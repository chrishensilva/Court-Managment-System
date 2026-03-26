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
    if (err) { console.error("Connection error:", err.message); process.exit(1); }

    // Show all users first
    db.query("SELECT id, username, email FROM users ORDER BY id", (err, results) => {
        if (err) { console.error(err.message); db.end(); return; }

        console.log("\n=== All users in database ===");
        results.forEach(u => console.log(`  ID:${u.id}  ${u.username}  <${u.email}>`));

        // Delete test/auto-seeded users that have test email patterns
        // Keep only real users (non-test emails)
        db.query(
            "DELETE FROM users WHERE email LIKE '%@test.com' AND username LIKE 'user_%'",
            (err, result) => {
                if (err) console.error("Delete error:", err.message);
                else console.log(`\nRemoved ${result.affectedRows} leftover test user(s).`);

                // Show remaining users
                db.query("SELECT id, username, email FROM users ORDER BY id", (err, remaining) => {
                    console.log("\n=== Remaining users ===");
                    if (!err) remaining.forEach(u => console.log(`  ID:${u.id}  ${u.username}  <${u.email}>`));
                    db.end();
                });
            }
        );
    });
});
