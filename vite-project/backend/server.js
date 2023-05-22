const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');


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
    const [tables] = await pool.query('SHOW TABLES');
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

// API route to update table data
app.put('/api/table/:tableName', async (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;

  try {
    await pool.query(`TRUNCATE TABLE ${tableName}`);
    await pool.query(`INSERT INTO ${tableName} SET ?`, data);
    res.json({ message: 'Table data updated successfully' });
  } catch (error) {
    console.error(`Error updating table ${tableName}:`, error);
    res.status(500).json({ error: `Failed to update table ${tableName}` });
  }
});

// API route to delete a row from a table
app.delete('/api/table/:tableName/:id', async (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;

  try {
    await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, id);
    res.json({ message: 'Row deleted successfully' });
  } catch (error) {
    console.error(`Error deleting row from table ${tableName}:`, error);
    res.status(500).json({ error: `Failed to delete row from table ${tableName}` });
  }
});

// API route to add a row to a table
app.post('/api/table/:tableName', async (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;

  try {
    await pool.query(`INSERT INTO ${tableName} SET ?`, data);
    res.json({ message: 'Row added successfully' });
  } catch (error) {
    console.error(`Error adding row to table ${tableName}:`, error);
    res.status(500).json({ error: `Failed to add row to table ${tableName}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});