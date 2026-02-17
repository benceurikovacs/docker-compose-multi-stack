const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DB_USER || 'devops',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'devopsdb',
    password: process.env.DB_PASS || 'secret123',
    port: process.env.DB_PORT || 5432,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as time, 'Hello from Backend!' as message");  // Egyszerűsített query
    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'DB connection failed: ' + err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
