import React, { useEffect, useState } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/tabulator.min.css';
import { fetchTableData, updateRecord } from '../services/api';

const TableComponent = ({ tableName }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      const data = await fetchTableData(tableName);
      setRecords(data);
    } catch (error) {
      console.error(`Error fetching records for table ${tableName}:`, error);
    }
  };

  // Generate column definitions dynamically based on data
  const columns = records.length > 0 ? Object.keys(records[0]).map((key) => ({
    title: key,
    field: key,
    editor: 'input', // Set the editor to 'input' for all columns
  })) : [];

  // Handle cell data change event
  const handleCellEdit = (cell) => {
    const { field, oldValue, newValue, row } = cell.getComponent();

    // Update the record with the new value
    const updatedRecord = { ...row.getData(), [field]: newValue };
    updateRecord(updatedRecord); // Implement the updateRecord function to update the record in the API/database

    // Update the records state with the updated record
    const updatedRecords = records.map((record) => {
      if (record.id === updatedRecord.id) {
        return updatedRecord;
      }
      return record;
    });
    setRecords(updatedRecords);
  };

  return (
    <div>
      {records.length > 0 ? (
        <ReactTabulator
          data={JSON.stringify(records)}
          columns={columns}
          options={{
            layout: 'fitColumns',
            responsiveLayout: 'hide',
            pagination:"local",
            paginationSize:20,
          }}
          autoColumns={true}
          cellEdited={handleCellEdit} // Add the cellEdited event handler
        />
      ) : (
        <p>No records available for table {tableName}</p>
      )}
    </div>
  );
};

export default TableComponent;