import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";
import { db } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef'; // Must be 32 chars
const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  if (!text) return null;
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}

app.use(cors({
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { status: 'error', message: "Too many login attempts, please try again after 15 minutes" }
});

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ status: 'error', message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ status: 'error', message: 'Invalid token' });
  }
};

// Serve React frontend in production
if (isProduction) {
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));
}

// --- DATABASE INITIALIZATION (MySQL) ---
const initMySQL = () => {
  // Create editors table
  const createEditorsTable = `
        CREATE TABLE IF NOT EXISTS editors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            permissions TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
  db.query(createEditorsTable, (err) => {
    if (err) console.error("Error creating editors table:", err);
  });

  // Create activity_log table
  const createLogsTable = `
        CREATE TABLE IF NOT EXISTS activity_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            action VARCHAR(255) NOT NULL,
            details TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
  db.query(createLogsTable, (err) => {
    if (err) console.error("Error creating logs table:", err);
  });

  // Ensure status column exists in userdata
  const checkStatusColumn = "SHOW COLUMNS FROM userdata LIKE 'status'";
  db.query(checkStatusColumn, (err, results) => {
    if (err) return;
    if (results.length === 0) {
      const addStatusColumn = "ALTER TABLE userdata ADD COLUMN status VARCHAR(50) DEFAULT 'ongoing'";
      db.query(addStatusColumn, (err) => {
        if (err) console.error("Error adding status column:", err);
      });
    }
  });

  // Create case_documents table
  const createDocsTable = `
        CREATE TABLE IF NOT EXISTS case_documents (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_nic VARCHAR(255) NOT NULL,
            file_name VARCHAR(255) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
  db.query(createDocsTable, (err) => {
    if (err) console.error("Error creating docs table:", err);
  });

  // Create user_profiles table
  const createProfilesTable = `
        CREATE TABLE IF NOT EXISTS user_profiles (
            username VARCHAR(255) PRIMARY KEY,
            fullname VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(20),
            avatar_url LONGTEXT,
            notifications JSON,
            language VARCHAR(20) DEFAULT 'English'
        )
    `;
  db.query(createProfilesTable, (err) => {
    if (err) console.error("Error creating profiles table:", err);
    // Ensure avatar_url column supports large Base64 strings
    db.query('ALTER TABLE user_profiles MODIFY avatar_url LONGTEXT', (err) => {
      if (err && !err.message.includes('Unknown column')) { /* ignore if already correct */ }
    });
  });

  // Create app_settings table (for SMTP and other global configs)
  const createSettingsTable = `
        CREATE TABLE IF NOT EXISTS app_settings (
            setting_key VARCHAR(255) PRIMARY KEY,
            setting_value TEXT,
            is_encrypted BOOLEAN DEFAULT FALSE
        )
    `;
  db.query(createSettingsTable, (err) => {
    if (err) console.error("Error creating settings table:", err);
  });

  // Create login_history table
  const createLoginHistoryTable = `
        CREATE TABLE IF NOT EXISTS login_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45),
            device_type TEXT
        )
    `;
  db.query(createLoginHistoryTable, (err) => {
    if (err) console.error("Error creating login history table:", err);
  });

  // Create subscription table
  const createSubscriptionTable = `
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            plan_name VARCHAR(255) DEFAULT 'Professional',
            renewal_date DATE,
            status VARCHAR(50) DEFAULT 'Active'
        )
    `;
  db.query(createSubscriptionTable, (err) => {
    if (err) console.error("Error creating subscription table:", err);
  });
};

initMySQL();

// --- HELPER: Log Activity ---
const logActivity = (username, action, details = "", req = null) => {
  const sql = "INSERT INTO activity_log (username, action, details) VALUES (?, ?, ?)";
  db.query(sql, [username, action, details], (err) => {
    if (err) console.error("Logging failed:", err);
  });

  if (action === 'Login' && req) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const device = req.headers['user-agent'];
    const historySql = "INSERT INTO login_history (username, ip_address, device_type) VALUES (?, ?, ?)";
    db.query(historySql, [username, ip, device], (err) => {
      if (err) console.error("Login history logging failed:", err);
    });
  }
};

// --- Email Transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chrishensilva@gmail.com',
    pass: 'gcne hqrr dzmb mqjo'
  }
});

// --- HELPER: Send Email ---
async function sendAssignmentEmail(lawyerEmail, lawyerName, user, caseNIC) {
  const mailOptions = {
    from: 'chrishensilva@gmail.com',
    to: lawyerEmail,
    subject: 'New Case Assigned - Court Record System',
    text: `Dear ${lawyerName},

You have been assigned a new case.

User Name: ${user.name}
NIC: ${caseNIC}
Email: ${user.email}
Contact: ${user.number}
Last Court Date: ${user.last_date}
Next Court Date: ${user.next_date}
Case Note: ${user.note || 'N/A'}

Please prepare accordingly.

Regards,
Court Record Management System`
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Image files are allowed'), false);
    }
  }
});

// Memory-based multer for avatar uploads (stored as Base64 in database)
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max for profile pictures
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for avatars'), false);
    }
  }
});

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// --- API ROUTES ---

// Get all lawyers
app.get('/api/getLawyers', authenticateToken, (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countSql = 'SELECT COUNT(*) as total FROM lawyerdata WHERE nic LIKE ? OR name LIKE ?';
  db.query(countSql, [`%${search}%`, `%${search}%`], (err, countResults) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = countResults[0].total;

    const sql = 'SELECT * FROM lawyerdata WHERE nic LIKE ? OR name LIKE ? LIMIT ? OFFSET ?';
    db.query(sql, [`%${search}%`, `%${search}%`, limit, offset], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    });
  });
});

// Get users (simple list)
app.get('/api/getUsers', authenticateToken, (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countSql = 'SELECT COUNT(*) as total FROM userdata WHERE nic LIKE ? OR name LIKE ?';
  db.query(countSql, [`%${search}%`, `%${search}%`], (err, countResults) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = countResults[0].total;

    const sql = 'SELECT * FROM userdata WHERE nic LIKE ? OR name LIKE ? ORDER BY next_date ASC LIMIT ? OFFSET ?';
    db.query(sql, [`%${search}%`, `%${search}%`, limit, offset], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    });
  });
});

// Get user cases (with assignments)
app.get('/api/getUserCases', authenticateToken, (req, res) => {
  const sql = `
        SELECT u.*, a.lawyer_name AS assigned_lawyer 
        FROM userdata u
        LEFT JOIN case_assignments a ON u.nic = a.user_nic
        ORDER BY u.next_date ASC
    `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

// Assign lawyer
app.post('/api/assignLawyer', authenticateToken, async (req, res) => {
  const { nic, lawyer, sendEmail } = req.body;
  if (!nic || !lawyer) return res.json({ status: 'error', message: 'NIC or lawyer missing' });

  const sql = 'REPLACE INTO case_assignments (user_nic, lawyer_name, assigned_date) VALUES (?, ?, ?)';
  db.query(sql, [nic, lawyer, new Date().toISOString().slice(0, 19).replace('T', ' ')], async (err) => {
    if (err) return res.json({ status: 'error', message: err.message });

    if (sendEmail) {
      db.query('SELECT email FROM lawyerdata WHERE name = ?', [lawyer], async (err, lawyers) => {
        if (!err && lawyers.length > 0) {
          db.query('SELECT * FROM userdata WHERE nic = ?', [nic], async (err, users) => {
            if (!err && users.length > 0) {
              await sendAssignmentEmail(lawyers[0].email, lawyer, users[0], nic);
            }
          });
        }
      });
    }
    res.json({ status: 'success', message: 'Lawyer assigned successfully' });
  });
});

// Add Lawyer
app.post('/api/addLawyer', authenticateToken, (req, res) => {
  const { name, nic, email, number, note } = req.body;
  const sql = 'INSERT INTO lawyerdata (name, nic, email, contact, note) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, nic, email, number, note], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'Lawyer added successfully' });
  });
});

app.post('/api/deleteLawyer', authenticateToken, (req, res) => {
  const { nic } = req.body;
  db.query('DELETE FROM lawyerdata WHERE nic = ?', [nic], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

// Add User
app.post('/api/addUser', authenticateToken, (req, res) => {
  const { name, nic, email, number, address, lawyer1, lawyer2, lawyer3, note, ldate, ndate, casetype } = req.body;
  const sql = `
        INSERT INTO userdata (name, nic, email, number, address, lawyer1, lawyer2, lawyer3, note, last_date, next_date, casetype) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  db.query(sql, [name, nic, email, number, address, lawyer1, lawyer2, lawyer3, note, ldate, ndate, casetype], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'User added successfully' });
  });
});

app.post('/api/deleteUser', authenticateToken, (req, res) => {
  const { nic } = req.body;
  db.query('DELETE FROM userdata WHERE nic = ?', [nic], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    db.query('DELETE FROM case_assignments WHERE user_nic = ?', [nic], () => {
      res.json({ status: 'success' });
    });
  });
});

// Update status
app.post('/api/updateStatus', authenticateToken, (req, res) => {
  const { nic, status } = req.body;
  const sql = 'UPDATE userdata SET status = ? WHERE nic = ?';
  db.query(sql, [status, nic], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

// Todos
app.get('/api/getTodos', authenticateToken, (req, res) => {
  db.query('SELECT * FROM todo ORDER BY date ASC, time ASC', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/addTodo', authenticateToken, (req, res) => {
  const { task, date, time } = req.body;
  db.query('INSERT INTO todo (task, date, time) VALUES (?, ?, ?)', [task, date, time], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

app.post('/api/deleteTodo', authenticateToken, (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM todo WHERE id = ?', [id], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

// Stats & Dashboard
app.get('/api/dashboard_counts', authenticateToken, (req, res) => {
  const sql = `
        SELECT 
            (SELECT COUNT(*) FROM userdata) as totalClients,
            (SELECT COUNT(*) FROM lawyerdata) as totalLawyers,
            (SELECT COUNT(*) FROM userdata) as totalCases
    `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      totalClients: results[0].totalClients,
      totalLawyers: results[0].totalLawyers,
      totalCases: results[0].totalCases
    });
  });
});

app.get('/api/getCaseStats', authenticateToken, (req, res) => {
  const sql = 'SELECT casetype AS name, COUNT(*) AS value FROM userdata GROUP BY casetype';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const stats = results.map(row => ({
      name: row.name ? (row.name.charAt(0).toUpperCase() + row.name.slice(1)) : 'Unknown',
      value: row.value
    }));
    res.json(stats);
  });
});

app.get('/api/getReportData', authenticateToken, (req, res) => {
  db.query('SELECT * FROM userdata ORDER BY next_date ASC', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

// Editors Management
app.get('/api/getEditors', authenticateToken, (req, res) => {
  db.query('SELECT id, username, permissions FROM editors', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/addEditor', async (req, res) => {
  const { username, password, permissions } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = 'INSERT INTO editors (username, password, permissions) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, JSON.stringify(permissions)], (err) => {
      if (err) return res.json({ status: 'error', message: err.message });
      res.json({ status: 'success' });
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating editor' });
  }
});

app.post('/api/deleteEditor', authenticateToken, (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM editors WHERE id = ?', [id], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Check Admin from .env
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const user = {
      username: process.env.ADMIN_USERNAME,
      role: 'admin',
      permissions: ['dashboard', 'lawyers', 'cases', 'assign', 'addlawyer', 'adduser', 'report', 'addeditor']
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    logActivity(user.username, 'Login', 'Admin logged into the system', req);
    return res.json({ status: 'success', user });
  }

  // Check Editors from DB
  const sql = 'SELECT * FROM editors WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });

    if (results.length > 0) {
      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.json({ status: 'error', message: 'Invalid credentials' });
      }

      const userData = {
        username: user.username,
        role: 'editor',
        permissions: JSON.parse(user.permissions)
      };

      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      logActivity(user.username, 'Login', 'Editor logged into the system', req);
      res.json({ status: 'success', user: userData });
    } else {
      res.json({ status: 'error', message: 'Invalid credentials' });
    }
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ status: 'success', message: 'Logged out successfully' });
});

app.get('/api/verifyToken', authenticateToken, (req, res) => {
  res.json({ status: 'success', user: req.user });
});

app.post('/api/uploadDocument', authenticateToken, upload.single('file'), (req, res) => {
  const { nic } = req.body;
  const file = req.file;

  if (!nic || !file) return res.json({ status: 'error', message: 'NIC or file missing' });

  const sql = 'INSERT INTO case_documents (user_nic, file_name, file_path) VALUES (?, ?, ?)';
  db.query(sql, [nic, file.originalname, `/uploads/${file.filename}`], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'Document uploaded successfully' });
  });
});

app.get('/api/getDocuments/:nic', authenticateToken, (req, res) => {
  const { nic } = req.params;
  const sql = 'SELECT * FROM case_documents WHERE user_nic = ?';
  db.query(sql, [nic], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/deleteDocument', authenticateToken, (req, res) => {
  const { id, path: filePath } = req.body;
  const sql = 'DELETE FROM case_documents WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });

    // Optional: Delete physical file
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    res.json({ status: 'success' });
  });
});

app.get('/api/getActivityLogs', authenticateToken, (req, res) => {
  const sql = `
    SELECT l.*, p.avatar_url 
    FROM activity_log l 
    LEFT JOIN user_profiles p ON l.username = p.username 
    ORDER BY l.timestamp DESC LIMIT 500
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/logAction', authenticateToken, (req, res) => {
  const { username, action, details } = req.body;
  logActivity(username, action, details);
  res.json({ status: 'success' });
});

// --- ACCOUNT MANAGEMENT ROUTES ---

// Get Profile
app.get('/api/getProfile', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM user_profiles WHERE username = ?';
  db.query(sql, [req.user.username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      // Return default profile if not exists
      res.json({
        username: req.user.username,
        fullname: '',
        email: '',
        phone: '',
        avatar_url: null,
        notifications: JSON.stringify({ caseAssigned: true, reminder: true }),
        language: 'English'
      });
    }
  });
});

// Update Profile
app.post('/api/updateProfile', authenticateToken, (req, res) => {
  const { fullname, email, phone, avatar_url } = req.body;
  const sql = `
    INSERT INTO user_profiles (username, fullname, email, phone, avatar_url) 
    VALUES (?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE fullname = VALUES(fullname), email = VALUES(email), phone = VALUES(phone), avatar_url = VALUES(avatar_url)
  `;
  db.query(sql, [req.user.username, fullname, email, phone, avatar_url], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    logActivity(req.user.username, 'Profile Update', 'User updated their personal profile');
    res.json({ status: 'success' });
  });
});

// Change Password
app.post('/api/changePassword', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // If editor, check DB
  if (req.user.role === 'editor') {
    db.query('SELECT password FROM editors WHERE username = ?', [req.user.username], async (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ error: 'User not found' });

      const valid = await bcrypt.compare(currentPassword, results[0].password);
      if (!valid) return res.json({ status: 'error', message: 'Current password incorrect' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      db.query('UPDATE editors SET password = ? WHERE username = ?', [hashedPassword, req.user.username], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        logActivity(req.user.username, 'Password Change', 'User changed their account password');
        res.json({ status: 'success' });
      });
    });
  } else if (req.user.role === 'admin') {
    // Admin password change (usually from .env, but we can prevent it or handle specifically)
    res.json({ status: 'error', message: 'Admin password can only be changed via server environment variables' });
  }
});

// Get Login Activity (Last 5)
app.get('/api/getLoginActivity', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM login_history WHERE username = ? ORDER BY timestamp DESC LIMIT 5';
  db.query(sql, [req.user.username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// SMTP Configuration (Admin Only)
app.get('/api/getSMTP', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  db.query('SELECT * FROM app_settings WHERE setting_key IN ("smtp_email", "smtp_password")', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const settings = {};
    results.forEach(r => {
      settings[r.setting_key] = r.is_encrypted ? decrypt(r.setting_value) : r.setting_value;
    });

    res.json({
      email: settings.smtp_email || '',
      password: settings.smtp_password ? '********' : '' // Don't send real password to frontend for display
    });
  });
});

app.post('/api/updateSMTP', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { email, password } = req.body;
  const encryptedPassword = encrypt(password);

  const queries = [
    { sql: 'INSERT INTO app_settings (setting_key, setting_value, is_encrypted) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)', params: ['smtp_email', email, false] }
  ];

  if (password && password !== '********') {
    queries.push({ sql: 'INSERT INTO app_settings (setting_key, setting_value, is_encrypted) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)', params: ['smtp_password', encryptedPassword, true] });
  }

  // Execute queries
  let count = 0;
  let hasError = false;
  queries.forEach(q => {
    db.query(q.sql, q.params, (err) => {
      count++;
      if (err) hasError = true;
      if (count === queries.length) {
        if (hasError) return res.status(500).json({ status: 'error' });
        logActivity(req.user.username, 'SMTP Update', 'Admin updated system SMTP settings');
        res.json({ status: 'success' });
      }
    });
  });
});

// Test SMTP
app.post('/api/testSMTP', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { email, password } = req.body;
  let testPassword = password;

  if (password === '********') {
    // Fetch current encrypted password
    const result = await new Promise((resolve) => {
      db.query('SELECT setting_value FROM app_settings WHERE setting_key = "smtp_password"', (err, results) => {
        if (!err && results.length > 0) resolve(decrypt(results[0].setting_value));
        else resolve(null);
      });
    });
    testPassword = result;
  }

  if (!email || !testPassword) return res.json({ status: 'error', message: 'Missing credentials' });

  const testTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: email, pass: testPassword }
  });

  try {
    await testTransporter.verify();
    res.json({ status: 'success' });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

// Subscription Info (Admin Only)
app.get('/api/getSubscription', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  db.query('SELECT * FROM subscriptions LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.json({ plan_name: 'Professional', renewal_date: '2026-03-26', status: 'Active' });
    }
  });
});

// Update Preferences
app.post('/api/updatePreferences', authenticateToken, (req, res) => {
  const { notifications, language } = req.body;
  const sql = `
    INSERT INTO user_profiles (username, notifications, language) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE notifications = VALUES(notifications), language = VALUES(language)
  `;
  db.query(sql, [req.user.username, JSON.stringify(notifications), language], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: 'success' });
  });
});

app.post('/api/uploadAvatar', authenticateToken, avatarUpload.single('avatar'), (req, res) => {
  if (!req.file) return res.json({ status: 'error', message: 'No file uploaded' });

  // Convert uploaded file buffer to Base64 data URI and store in database
  // This ensures persistence on cloud platforms (Railway) where filesystem is ephemeral
  const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  const sql = `
    INSERT INTO user_profiles (username, avatar_url) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE avatar_url = VALUES(avatar_url)
  `;

  db.query(sql, [req.user.username, base64Image], (err) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    res.json({ status: 'success', avatar_url: base64Image });
  });
});

// Catch-all: serve React app for any non-API route (SPA support)
if (isProduction) {
  const distPath = path.join(__dirname, '../../dist');
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
