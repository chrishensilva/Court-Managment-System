import { db } from './src/js/db.js';

const userId = 2; // Let's pretend owner_id=2
const email = 'testuser2@gmail.com';
const queries = [
    { sql: 'INSERT INTO app_settings (owner_id, setting_key, setting_value, is_encrypted) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)', params: [userId, 'smtp_email', email, false] }
  ];

db.query(queries[0].sql, queries[0].params, (err) => {
  if (err) console.error("Insert error:", err);
  else console.log("Insert success");
  process.exit(0);
});
