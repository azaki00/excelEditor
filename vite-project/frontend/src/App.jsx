import React, { useState, useEffect } from 'react';
import './App.css';
import TableComponent from './components/Table/TableComponent';
import { fetchTables, fetchTableData } from './components/services/api';
import { ReactTabulator} from 'react-tabulator';

function App() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableOptions, setTableOptions] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableOptions();
  }, []);

  // Fetch the list of tables
  async function fetchTableOptions() {
    try {
      const tables = await fetchTables();
      setTableOptions(tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  }

  const handleTableSelect = (event) => {
    setSelectedTable(event.target.value);
  };

  // Fetch table data
  async function fetchSelectedTableData() {
    try {
      const data = await fetchTableData(selectedTable);
      setTableData(data);
    } catch (error) {
      console.error(`Error fetching data from table ${selectedTable}:`, error);
    }
  }

  const handleProceedClick = () => {
    if (selectedTable) {
      fetchSelectedTableData();
    }
  };


  return (
    <div className='main-wrapper'>
      <h2>Choose your table</h2>
      <br />
      {tableOptions.length === 0 ? (
        <p>No available tables</p>
      ) : (
        <>
          <select value={selectedTable} onChange={handleTableSelect}>
            {tableOptions.map((table) => (
              <option key={table} value={table}>
              {table}
            </option>
            ))}
          </select>
          <br />
          {/* <button onClick={handleProceedClick}>Proceed</button> */}
        </>
      )}
      <div className='tabulator-wrapper'>
        {selectedTable && <TableComponent tableName={selectedTable} />}
      </div>
    </div>
  );
}

export default App;