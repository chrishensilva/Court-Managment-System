import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

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
};

initMySQL();

// --- HELPER: Log Activity ---
const logActivity = (username, action, details = "") => {
  const sql = "INSERT INTO activity_log (username, action, details) VALUES (?, ?, ?)";
  db.query(sql, [username, action, details], (err) => {
    if (err) console.error("Logging failed:", err);
  });
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

// --- API ROUTES ---

// Get all lawyers
app.get('/api/getLawyers', (req, res) => {
  const search = req.query.search || '';
  const sql = 'SELECT * FROM lawyerdata WHERE nic LIKE ? OR name LIKE ?';
  db.query(sql, [`%${search}%`, `%${search}%`], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

// Get users (simple list)
app.get('/api/getUsers', (req, res) => {
  const search = req.query.search || '';
  const sql = 'SELECT * FROM userdata WHERE nic LIKE ? OR name LIKE ? ORDER BY next_date ASC';
  db.query(sql, [`%${search}%`, `%${search}%`], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

// Get user cases (with assignments)
app.get('/api/getUserCases', (req, res) => {
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
app.post('/api/assignLawyer', async (req, res) => {
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
app.post('/api/addLawyer', (req, res) => {
  const { name, nic, email, number, note } = req.body;
  const sql = 'INSERT INTO lawyerdata (name, nic, email, contact, note) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, nic, email, number, note], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'Lawyer added successfully' });
  });
});

app.post('/api/deleteLawyer', (req, res) => {
  const { nic } = req.body;
  db.query('DELETE FROM lawyerdata WHERE nic = ?', [nic], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

// Add User
app.post('/api/addUser', (req, res) => {
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

app.post('/api/deleteUser', (req, res) => {
  const { nic } = req.body;
  db.query('DELETE FROM userdata WHERE nic = ?', [nic], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    db.query('DELETE FROM case_assignments WHERE user_nic = ?', [nic], () => {
      res.json({ status: 'success' });
    });
  });
});

// Update status
app.post('/api/updateStatus', (req, res) => {
  const { nic, status } = req.body;
  const sql = 'UPDATE userdata SET status = ? WHERE nic = ?';
  db.query(sql, [status, nic], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

// Todos
app.get('/api/getTodos', (req, res) => {
  db.query('SELECT * FROM todo ORDER BY date ASC, time ASC', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/addTodo', (req, res) => {
  const { task, date, time } = req.body;
  db.query('INSERT INTO todo (task, date, time) VALUES (?, ?, ?)', [task, date, time], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

app.post('/api/deleteTodo', (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM todo WHERE id = ?', [id], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

// Stats & Dashboard
app.get('/api/dashboard_counts', (req, res) => {
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

app.get('/api/getCaseStats', (req, res) => {
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

app.get('/api/getReportData', (req, res) => {
  db.query('SELECT * FROM userdata ORDER BY next_date ASC', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

// Editors Management
app.get('/api/getEditors', (req, res) => {
  db.query('SELECT id, username, permissions FROM editors', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/addEditor', (req, res) => {
  const { username, password, permissions } = req.body;
  const sql = 'INSERT INTO editors (username, password, permissions) VALUES (?, ?, ?)';
  db.query(sql, [username, password, JSON.stringify(permissions)], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

app.post('/api/deleteEditor', (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM editors WHERE id = ?', [id], (err) => {
    if (err) return res.json({ status: 'error', message: err.message });
    res.json({ status: 'success' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123') {
    logActivity('admin', 'Login', 'Admin logged into the system');
    return res.json({
      status: 'success',
      user: { username: 'admin', role: 'admin', permissions: ['dashboard', 'lawyers', 'cases', 'assign', 'addlawyer', 'adduser', 'report', 'addeditor'] }
    });
  }

  const sql = 'SELECT * FROM editors WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    if (results.length > 0) {
      const user = results[0];
      logActivity(user.username, 'Login', 'Editor logged into the system');
      res.json({
        status: 'success',
        user: { username: user.username, role: 'editor', permissions: JSON.parse(user.permissions) }
      });
    } else {
      res.json({ status: 'error', message: 'Invalid credentials' });
    }
  });
});

app.get('/api/getActivityLogs', (req, res) => {
  const sql = "SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 500";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/logAction', (req, res) => {
  const { username, action, details } = req.body;
  logActivity(username, action, details);
  res.json({ status: 'success' });
});

// Catch-all: serve React app for any non-API route (SPA support)
if (isProduction) {
  const distPath = path.join(__dirname, '../../dist');
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`MySQL API Server running at http://0.0.0.0:${port}`);
});
