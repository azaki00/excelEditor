import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/tabulator.min.css';
import { fetchTableData, updateRecord } from '../services/api';

const TableComponent = ({ tableName }, ref) => {
  const [records, setRecords] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  useEffect(() => {
    setUpdatedData(records);
  }, [records]);

  const fetchData = async () => {
    try {
      const data = await fetchTableData(tableName);
      setRecords(data);
      setUpdatedData(data);
    } catch (error) {
      console.error(`Error fetching records for table ${tableName}:`, error);
    }
  };

  const handleCellEdit = async (cell) => {
    const { field, newValue, row } = cell.getComponent();
    const updatedRecord = { ...row.getData(), [field]: newValue };
  
    const updatedRecords = updatedData.map((record) => {
      if (record.id === updatedRecord.id) {
        return updatedRecord;
      }
      return record;
    });
  
    setUpdatedData(updatedRecords);
  };

  const handleUpdateData = async () => {
    try {
      const updatedRecords = updatedData.filter((record) => {
        const originalRecord = records.find((r) => r.id === record.id);
        return Object.keys(record).some((key) => record[key] !== originalRecord[key]);
      });
  
      await Promise.all(updatedRecords.map((record) => updateRecord(tableName, record)));
      setRecords(updatedData);
      console.log('Table data updated successfully:', updatedRecords);
    } catch (error) {
      console.error('Error updating table data:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshTable: fetchData,
  }));

  const columns = records.length > 0
    ? Object.keys(records[0]).map((key) => ({
        title: key,
        field: key,
        editor: 'input',
      }))
    : [];

  return (
    <div>
      {records.length > 0 ? (
        <>
          <ReactTabulator
            ref={ref}
            data={JSON.stringify(records)}
            columns={columns}
            options={{
              layout: 'fitData',
              responsiveLayout: 'hide',
              pagination: 'local',
              paginationSize: 20,
            }}
            autoColumns={true}
            cellEdited={handleCellEdit}
          />
          <button onClick={handleUpdateData}>Update Table Data</button>
        </>
      ) : (
        <p>No records available for table {tableName}</p>
      )}
    </div>
  );
};

export default forwardRef(TableComponent);