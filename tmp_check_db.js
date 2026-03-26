import { db } from './src/js/db.js';

db.query('SELECT * FROM app_settings', (err, results) => {
  if (err) console.error(err);
  else console.log(results);
  process.exit(0);
});
