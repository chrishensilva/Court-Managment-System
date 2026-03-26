import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Often needed for Aiven if you don't have the CA cert
  }
});

db.connect((err) => {
  if (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
  console.log("Connected to Aiven MySQL!");
  db.query("SHOW TABLES", (err, results) => {
    if (err) {
      console.error("Query error:", err.message);
    } else {
      console.log("Tables:", results);
    }
    db.end();
  });
});
