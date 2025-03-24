const mysql = require("mysql2");
require("dotenv").config();

// Optional: log to verify env variables (remove in production)
console.log("Connecting to DB at:", process.env.DB_HOST);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Needed for Aiven
  },
});

// Initial connection test
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL database successfully!");
  connection.release();
});

module.exports = db.promise();
