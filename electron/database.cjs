const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { workerData } = require('worker_threads');

let dbPath;

let isElectron = false;
try {
  require.resolve('electron');
  isElectron = true;
} catch (e) { }

if (workerData && workerData.userDataPath) {
  // We are running in a worker thread
  dbPath = workerData.isPackaged
    ? path.join(workerData.userDataPath, 'database.sqlite')
    : path.join(__dirname, '../database.sqlite');
} else if (isElectron) {
  // We are running in the main process of Electron
  try {
    const { app } = require('electron');
    if (app) {
      dbPath = app.isPackaged
        ? path.join(app.getPath('userData'), 'database.sqlite')
        : path.join(__dirname, '../database.sqlite');
    } else {
      dbPath = path.join(__dirname, '../database.sqlite');
    }
  } catch (e) {
    dbPath = path.join(__dirname, '../database.sqlite');
  }
} else {
  // We are running in plain Node
  dbPath = path.join(__dirname, '../database.sqlite');
}

const db = new Database(dbPath);

function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS case_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_nic TEXT NOT NULL UNIQUE,
      lawyer_name TEXT NOT NULL,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lawyerdata (
      nic TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      contact TEXT NOT NULL,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS userdata (
      nic TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      number TEXT NOT NULL,
      address TEXT,
      lawyer1 TEXT NOT NULL,
      lawyer2 TEXT,
      lawyer3 TEXT,
      note TEXT,
      last_date TEXT NOT NULL,
      next_date TEXT NOT NULL,
      casetype TEXT NOT NULL,
      status TEXT DEFAULT 'ongoing'
    );

    CREATE TABLE IF NOT EXISTS editors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      permissions TEXT NOT NULL, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `;

  db.exec(schema);

  // Seed data if empty
  const lawyerCount = db.prepare('SELECT count(*) as count FROM lawyerdata').get().count;
  const userCount = db.prepare('SELECT count(*) as count FROM userdata').get().count;

  if (lawyerCount === 0 && userCount === 0) {
    console.log('Database empty. Migrating data from userdb (1).sql...');
    try {
      const sqlPath = path.join(__dirname, '../userdb (1).sql');
      if (fs.existsSync(sqlPath)) {
        let sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Extract only INSERT statements
        const insertMatches = sqlContent.match(/INSERT INTO .*?;/gs);
        if (insertMatches) {
          db.transaction(() => {
            for (let statement of insertMatches) {
              // Basic cleaning for SQLite compatibility (backticks are fine, but remove MySQL-specific escape chars if any)
              // In this specific SQL, it looks standard enough.
              try {
                db.exec(statement);
              } catch (e) {
                console.warn('Failed to execute statement:', statement, e.message);
              }
            }
          })();
          console.log('Seed successful.');
        }
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}

// Update case status
// Note: This block assumes 'app' is an Express app instance, which is not defined in this db.js file.
// If this is an Electron context, this logic should be integrated via IPC or a dedicated server file.
// If this is meant for a separate Express server, this code should be in that server file.
// For now, we'll define a placeholder function that can be called by an external server/IPC.
function updateCaseStatus(nic, status) {
  try {
    db.prepare('UPDATE userdata SET status = ? WHERE nic = ?').run(status, nic);
    return { status: 'success' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

// Editors Management functions (assuming these are called via IPC in Electron or an external API)
function getEditors() {
  try {
    const editors = db.prepare('SELECT id, username, permissions FROM editors').all();
    return { status: 'success', data: editors };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function addEditor(username, password, permissions) {
  try {
    const stmt = db.prepare('INSERT INTO editors (username, password, permissions) VALUES (?, ?, ?)');
    stmt.run(username, password, JSON.stringify(permissions));
    return { status: 'success' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function deleteEditor(id) {
  try {
    db.prepare('DELETE FROM editors WHERE id = ?').run(id);
    return { status: 'success' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function loginEditor(username, password) {
  // Hardcoded Admin
  if (username === 'admin' && password === '123') {
    return {
      status: 'success',
      user: { username: 'admin', role: 'admin', permissions: ['dashboard', 'lawyers', 'cases', 'assign', 'addlawyer', 'adduser', 'report', 'addeditor'] }
    };
  }

  try {
    const user = db.prepare('SELECT * FROM editors WHERE username = ? AND password = ?').get(username, password);
    if (user) {
      return {
        status: 'success',
        user: { username: user.username, role: 'editor', permissions: JSON.parse(user.permissions) }
      };
    } else {
      return { status: 'error', message: 'Invalid credentials' };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function logActivitySQLite(username, action, details = "") {
  try {
    db.prepare('INSERT INTO activity_log (username, action, details) VALUES (?, ?, ?)')
      .run(username, action, details);
  } catch (error) {
    console.error('SQLite Logging failed:', error);
  }
}

module.exports = { db, initDb, updateCaseStatus, getEditors, addEditor, deleteEditor, loginEditor, logActivitySQLite };
