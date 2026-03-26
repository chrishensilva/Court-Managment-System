import { db } from './src/js/db.js';

db.query('SHOW INDEX FROM userdata', (err, results) => {
  if (err) console.error(err);
  else results.forEach(r => console.log(`${r.Table}: ${r.Key_name} on ${r.Column_name}`));
  process.exit(0);
});
