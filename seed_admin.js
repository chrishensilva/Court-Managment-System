import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "userdb",
});

db.connect(async (err) => {
    if (err) {
        console.error("Connection error:", err.message);
        process.exit(1);
    }
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "123";
    const email = "admin@example.com";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query("INSERT IGNORE INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], (err, result) => {
        if (err) {
            console.error("Query error:", err.message);
        } else {
            console.log("Admin user seeded if it didn't exist.");
        }
        db.end();
    });
});
