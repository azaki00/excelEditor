const API_URL = 'http://localhost:3001/api';

// Fetch the list of tables
export async function fetchTables() {
  try {
    const response = await fetch(`${API_URL}/tables`);
    const tables = await response.json();
    const tableNames = tables.map((table) => table["Tables_in_z-table"]);
    return tableNames;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
}

// Fetch table data
export async function fetchTableData(tableName) {
  try {
    const response = await fetch(`${API_URL}/table/${tableName}`);
    const tableData = await response.json();
    return tableData;
  } catch (error) {
    console.error(`Error fetching data from table ${tableName}:`, error);
    throw error;
  }
}


// Update a record
export async function updateRecord(tableName, record) {
    try {
      const response = await fetch(`${API_URL}/table/${tableName}/${record.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update record');
      }
  
      console.log('Record updated successfully:', record);
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }