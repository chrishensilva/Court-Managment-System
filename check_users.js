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
    if (err) {
        console.error("Connection error:", err.message);
        process.exit(1);
    }
    db.query("SELECT id, username, role FROM users", (err, results) => {
        if (err) {
            console.error("Query error:", err.message);
        } else {
            console.log("Users in database:", results);
        }
        db.end();
    });
});
