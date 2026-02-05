import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'restorants_1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // default MySQL port
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});

export default connection;
