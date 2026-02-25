import mysql from "mysql2";
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "userdb",
});

db.connect((err) => {
    if (err) {
        console.error("Connection error:", err.message);
        process.exit(1);
    }
    console.log("Connected to MySQL!");
    db.query("SHOW TABLES", (err, results) => {
        if (err) {
            console.error("Query error:", err.message);
        } else {
            console.log("Tables:", results);
        }
        db.end();
    });
});
