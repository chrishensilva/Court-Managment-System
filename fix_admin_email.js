import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "userdb",
});

db.connect((err) => {
    if (err) { console.error(err.message); process.exit(1); }
    db.query(
        "UPDATE users SET email='admin@system.local' WHERE username='admin' AND email='admin@example.com'",
        (err, result) => {
            console.log(err ? "Error: " + err.message : `Updated ${result.affectedRows} row(s). Admin email is now admin@system.local`);
            db.end();
        }
    );
});
