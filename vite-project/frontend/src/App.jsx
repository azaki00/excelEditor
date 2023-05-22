import React, { useState } from 'react';
import './App.css';
import { useEffect } from 'react';

function App() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableOptions, setTableOptions] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch the list of tables
  async function fetchTables() {
    try {
      const response = await fetch('http://localhost:3001/api/tables');
      const tables = await response.json();
      const tableNames = Object.values(tables).map((table) => table['Tables_in_z-table']);
      setTableOptions(tableNames);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  }

  const handleTableSelect = (event) => {
    setSelectedTable(event.target.value);
  };

  // Fetch table data
  async function fetchTableData(tableName) {
    try {
      const response = await fetch(`http://localhost:3001/api/tables/${tableName}`);
      const tableData = await response.json();
      setResponse(tableData);
    } catch (error) {
      console.error(`Error fetching data from table ${tableName}:`, error);
    }
  }


  // Update table data
  async function updateTableData(tableName, data) {
    try {
      const response = await fetch(`http://localhost:3001/api/tables/${tableName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error updating table ${tableName}:`, error);
    }
  }

  // Delete a row from a table
  async function deleteRow(tableName, id) {
    try {
      const response = await fetch(`/api/table/${tableName}/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error deleting row from table ${tableName}:`, error);
    }
  }

  // Add a row to a table
  async function addRow(tableName, data) {
    try {
      const response = await fetch(`/api/table/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error adding row to table ${tableName}:`, error);
    }
  }

  const getTableData = () => {
    const choice = document.getElementById("table-select");
    const selectedTable = choice.options[choice.selectedIndex].value;
    fetchTableData(selectedTable);
  };

const tableEdit = () => {
  
}

  return (
    <div>
      <h2>Choose your table</h2>
      {/* <button onClick={fetchTables}>Fetch Tables</button> */}
      <br />
      {tableOptions.length === 0 ? (
        <p>No available tables</p>
      ) : (<>
        <select value={selectedTable} onChange={handleTableSelect}>
          {tableOptions.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
            <br />
        <button onClick={() => tableEdit()}> Procceed</button>
      </>
      )}
    </div>
    
  );
}

export default App;