import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const isRemote = process.env.DB_HOST && process.env.DB_HOST !== "localhost";

console.log("=== DB CONFIG ===");
console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("PORT:", process.env.DB_PORT);
console.log("NAME:", process.env.DB_NAME);
console.log("PASSWORD SET:", process.env.DB_PASSWORD ? "YES" : "NO");
console.log("SSL:", isRemote ? "ENABLED" : "DISABLED");
console.log("=================");

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "userdb",
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});
