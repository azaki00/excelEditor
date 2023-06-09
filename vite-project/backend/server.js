const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const Table = require('./src/models/Table');
const dbConfig = require('./src/config/database');


const app = express();
const PORT = 3001;
app.use(cors());
// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'z-table',
  connectionLimit: 10, // Adjust the connection limit as per your requirement
});

// API route to fetch the list of tables
app.get('/api/tables', async (req, res) => {
  try {
    const tables = await Table.fetchAll();
    console.log(dbConfig);
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});



// API route to fetch table data
app.get('/api/table/:tableName', async (req, res) => {
  const tableName = req.params.tableName;

  try {
    const [tableData] = await pool.query(`SELECT * FROM ${tableName}`);
    res.json(tableData);
  } catch (error) {
    console.error(`Error fetching data from table ${tableName}:`, error);
    res.status(500).json({ error: `Failed to fetch data from table ${tableName}` });
  }
});

// Update a record
app.put('/table/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
  const updatedRecord = req.body;

  // Update the record in your database
  // Replace the code below with your actual database update logic

  // Assuming you have a 'tables' object that stores your table data
  const table = tables[tableName];
  if (!table) {
    res.status(404).json({ error: 'Table not found' });
    return;
  }

  const recordIndex = table.findIndex((record) => record.id === id);
  if (recordIndex === -1) {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  table[recordIndex] = updatedRecord;

  res.json({ message: 'Record updated successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});