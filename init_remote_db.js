import { db } from "./src/js/db.js";

const initializeDatabase = async () => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS lawyerdata (
            nic VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            contact VARCHAR(50),
            note TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS userdata (
            nic VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            number VARCHAR(50),
            address TEXT,
            lawyer1 VARCHAR(255),
            lawyer2 VARCHAR(255),
            lawyer3 VARCHAR(255),
            note TEXT,
            last_date DATE,
            next_date DATE,
            casetype VARCHAR(100),
            status VARCHAR(50) DEFAULT 'ongoing',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS case_assignments (
            user_nic VARCHAR(50),
            lawyer_name VARCHAR(255),
            assigned_date DATETIME,
            PRIMARY KEY (user_nic, lawyer_name)
        )`,
        `CREATE TABLE IF NOT EXISTS todo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            task TEXT NOT NULL,
            date DATE,
            time TIME
        )`,
        `CREATE TABLE IF NOT EXISTS editors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            permissions TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS activity_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            action VARCHAR(255) NOT NULL,
            details TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    console.log("Starting database initialization...");

    for (const query of queries) {
        try {
            await db.promise().query(query);
            console.log("Executed query successfully.");
        } catch (err) {
            console.error("Error executing query:", err.message);
        }
    }

    console.log("Database initialization complete.");
    process.exit(0);
};

initializeDatabase();
