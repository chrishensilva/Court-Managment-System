import { db } from './src/js/db.js';

const runTest = async () => {
  const userId = 2; 

  console.log("Inserting for owner_id=2...");
  await new Promise((res, rej) => {
    db.query('INSERT INTO app_settings (owner_id, setting_key, setting_value, is_encrypted) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)', 
      [userId, 'smtp_email', 'test2@gmail.com', false], (err) => {
      if (err) rej(err); else res();
    });
  });

  console.log("Fetching for owner_id=2...");
  await new Promise((res, rej) => {
    db.query('SELECT * FROM app_settings WHERE owner_id = ?', [userId], (err, results) => {
      if (err) rej(err); 
      else { console.log(results); res(); }
    });
  });

  process.exit(0);
};

runTest().catch(console.error);
