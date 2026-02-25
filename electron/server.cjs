const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { db, initDb, logActivitySQLite } = require('./database.cjs');

const app = express();
const port = 5000;

// Enable CORS for all origins, including file:// (which sends null origin)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Database
initDb();

// --- Email Transporter ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chrishensilva@gmail.com',
        pass: 'gcne hqrr dzmb mqjo' // Using the app password from PHP
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
    try {
        const sql = 'SELECT * FROM lawyerdata WHERE nic LIKE ? OR name LIKE ?';
        const lawyers = db.prepare(sql).all(`%${search}%`, `%${search}%`);
        res.json(lawyers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get users (simple list)
app.get('/api/getUsers', (req, res) => {
    const search = req.query.search || '';
    try {
        const sql = 'SELECT * FROM userdata WHERE nic LIKE ? OR name LIKE ? ORDER BY next_date ASC';
        const users = db.prepare(sql).all(`%${search}%`, `%${search}%`);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get user cases (with assignments)
app.get('/api/getUserCases', (req, res) => {
    try {
        const sql = `
            SELECT u.*, a.lawyer_name AS assigned_lawyer 
            FROM userdata u
            LEFT JOIN case_assignments a ON u.nic = a.user_nic
            ORDER BY u.next_date ASC
        `;
        const users = db.prepare(sql).all();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assign lawyer
app.post('/api/assignLawyer', async (req, res) => {
    const { nic, lawyer, sendEmail } = req.body;

    if (!nic || !lawyer) {
        return res.json({ status: 'error', message: 'NIC or lawyer missing' });
    }

    try {
        const update = db.prepare('INSERT OR REPLACE INTO case_assignments (user_nic, lawyer_name, assigned_date) VALUES (?, ?, ?)');
        update.run(nic, lawyer, new Date().toISOString());

        if (sendEmail) {
            const lawyerData = db.prepare('SELECT email FROM lawyerdata WHERE name = ?').get(lawyer);
            if (lawyerData) {
                const userData = db.prepare('SELECT * FROM userdata WHERE nic = ?').get(nic);
                await sendAssignmentEmail(lawyerData.email, lawyer, userData, nic);
            }
        }

        res.json({ status: 'success', message: 'Lawyer assigned successfully' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

// Lawyers CRUD
app.post('/api/addLawyer', (req, res) => {
    const { name, nic, email, number, note } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO lawyerdata (name, nic, email, contact, note) VALUES (?, ?, ?, ?, ?)');
        stmt.run(name, nic, email, number, note);
        res.json({ status: 'success', message: 'Lawyer added successfully' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

app.post('/api/deleteLawyer', (req, res) => {
    const { nic } = req.body;
    try {
        db.prepare('DELETE FROM lawyerdata WHERE nic = ?').run(nic);
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});


// Users CRUD
app.post('/api/addUser', (req, res) => {
    const { name, nic, email, number, address, lawyer1, lawyer2, lawyer3, note, ldate, ndate, casetype } = req.body;
    try {
        const stmt = db.prepare(`
            INSERT INTO userdata (name, nic, email, number, address, lawyer1, lawyer2, lawyer3, note, last_date, next_date, casetype) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(name, nic, email, number, address, lawyer1, lawyer2, lawyer3, note, ldate, ndate, casetype);
        res.json({ status: 'success', message: 'User added successfully' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});


app.post('/api/deleteUser', (req, res) => {
    const { nic } = req.body;
    try {
        db.prepare('DELETE FROM userdata WHERE nic = ?').run(nic);
        // Also delete assignment if exists
        db.prepare('DELETE FROM case_assignments WHERE user_nic = ?').run(nic);
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

app.post('/api/updateStatus', (req, res) => {
    const { nic, status } = req.body;
    try {
        db.prepare('UPDATE userdata SET status = ? WHERE nic = ?').run(status, nic);
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

// Todos
app.get('/api/getTodos', (req, res) => {
    try {
        const todos = db.prepare('SELECT * FROM todo ORDER BY date ASC, time ASC').all();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/addTodo', (req, res) => {
    const { task, date, time } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO todo (task, date, time) VALUES (?, ?, ?)');
        stmt.run(task, date, time);
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

app.post('/api/deleteTodo', (req, res) => {
    const { id } = req.body;
    try {
        const stmt = db.prepare('DELETE FROM todo WHERE id = ?');
        stmt.run(id);
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

// Stats & Dashboard
app.get('/api/dashboard_counts', (req, res) => {
    try {
        const clients = db.prepare('SELECT count(*) as total FROM userdata').get().total;
        const lawyers = db.prepare('SELECT count(*) as total FROM lawyerdata').get().total;
        const cases = db.prepare('SELECT count(*) as total FROM userdata').get().total;
        res.json({
            totalClients: clients,
            totalLawyers: lawyers,
            totalCases: cases
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/getCaseStats', (req, res) => {
    try {
        const sql = 'SELECT casetype AS name, COUNT(*) AS value FROM userdata GROUP BY casetype';
        const stats = db.prepare(sql).all().map(row => ({
            name: row.name.charAt(0).toUpperCase() + row.name.slice(1),
            value: row.value
        }));
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Editors Management
app.get('/api/getEditors', (req, res) => {
    try {
        const editors = db.prepare('SELECT id, username, permissions FROM editors').all();
        res.json(editors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/addEditor', (req, res) => {
    const { username, password, permissions } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO editors (username, password, permissions) VALUES (?, ?, ?)');
        stmt.run(username, password, JSON.stringify(permissions));
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

app.post('/api/deleteEditor', (req, res) => {
    const { id } = req.body;
    try {
        db.prepare('DELETE FROM editors WHERE id = ?').run(id);
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
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
    try {
        const user = db.prepare('SELECT * FROM editors WHERE username = ? AND password = ?').get(username, password);
        if (user) {
            logActivity(user.username, 'Login', 'Editor logged into the system');
            res.json({
                status: 'success',
                user: { username: user.username, role: 'editor', permissions: JSON.parse(user.permissions) }
            });
        } else {
            res.json({ status: 'error', message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/api/getActivityLogs', (req, res) => {
    try {
        const logs = db.prepare('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 500').all();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/logAction', (req, res) => {
    const { username, action, details } = req.body;
    logActivity(username, action, details);
    res.json({ status: 'success' });
});

app.get('/api/getReportData', (req, res) => {
    try {
        const data = db.prepare('SELECT * FROM userdata ORDER BY next_date ASC').all();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export server to be used in main process
function startServer() {
    const server = app.listen(port, '127.0.0.1', () => {
        console.log(`Standalone API Server running at http://127.0.0.1:${port}`);
    }).on('error', (err) => {
        console.error('SERVER ERROR:', err);
    });
}

const { isMainThread } = require('worker_threads');
if (!isMainThread || require.main === module) {
    startServer();
}

module.exports = { startServer };
