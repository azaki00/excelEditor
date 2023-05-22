// controllers/recordsController.js

const RecordModel = require('../models/recordModel');

const RecordsController = {
  getAllRecords: async (req, res) => {
    try {
      const records = await RecordModel.getAllRecords();
      res.json(records);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  },

  createRecord: async (req, res) => {
    const recordData = req.body;
    try {
      const result = await RecordModel.createRecord(recordData);
      const createdRecord = { ...recordData, id: result.insertId };
      res.json(createdRecord);
    } catch (error) {
      console.error('Error creating record:', error);
      res.status(500).json({ error: 'Failed to create record' });
    }
  },

  updateRecord: async (req, res) => {
    const recordId = req.params.id;
    const recordData = req.body;
    try {
      await RecordModel.updateRecord(recordId, recordData);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({ error: 'Failed to update record' });
    }
  },

  deleteRecord: async (req, res) => {
    const recordId = req.params.id;
    try {
      await RecordModel.deleteRecord(recordId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  },
};

module.exports = RecordsController;