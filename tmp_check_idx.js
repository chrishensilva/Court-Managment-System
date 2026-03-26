import { db } from './src/js/db.js';

db.query('SHOW INDEX FROM app_settings', (err, results) => {
  if (err) console.error(err);
  else {
    results.forEach(r => console.log(`Key: ${r.Key_name}, Col: ${r.Column_name}, Non_unique: ${r.Non_unique}, Seq: ${r.Seq_in_index}`));
  }
  process.exit(0);
});
