// models/Table.js

const pool = require('../config/database');

const Table = {
  fetchAll: async () => {
    try {
      const [tables] = await pool.query('SHOW TABLES');
      return tables;
    } catch (error) {
      throw new Error(`Failed to fetch tables: ${error}`);
    }
  },

  fetchData: async (tableName) => {
    try {
      const [tableData] = await pool.query(`SELECT * FROM ${tableName}`);
      return tableData;
    } catch (error) {
      throw new Error(`Failed to fetch data from table ${tableName}: ${error}`);
    }
  },
};

module.exports = Table;