import { db } from './src/js/db.js';

db.query('SELECT @@sql_mode as mode', (err, results) => {
  if (err) console.error(err);
  else console.log(results[0].mode);
  process.exit(0);
});
