const express = require('express');
const multer = require('multer');
const path = require('path');
const PestReport = require('../models/PestReport');

const router = express.Router();

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pest-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// POST / - Farmer: Create New Pest Report
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { farmerName, location, pestType, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    if (!farmerName || !location || !pestType || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newReport = new PestReport({
      farmerName,
      location,
      pestType,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
      status: 'Pending'
    });

    await newReport.save();
    res.status(201).json({
      message: 'Pest report submitted successfully',
      report: newReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to submit report', details: error.message });
  }
});

// GET / - Admin: Fetch All Reports (Sorted by Newest First)
router.get('/', async (req, res) => {
  try {
    const reports = await PestReport.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
  }
});

// GET /:id - Admin: Fetch Single Report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await PestReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report', details: error.message });
  }
});

// PUT /:id - Admin: Update Report Status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Pending', 'Resolved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const report = await PestReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json({
      message: 'Report status updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report', details: error.message });
  }
});

// POST /broadcast - Admin: Broadcast Alert via Socket.IO
router.post('/broadcast', async (req, res) => {
  try {
    const { reportId, alertMessage, severity } = req.body;

    if (!reportId || !alertMessage || !severity) {
      return res.status(400).json({ error: 'reportId, alertMessage, and severity are required' });
    }

    // Find the report and mark it as Resolved
    const report = await PestReport.findByIdAndUpdate(
      reportId,
      { status: 'Resolved' },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Retrieve Socket.IO instance
    const io = req.app.get('socketio');

    if (!io) {
      return res.status(500).json({ error: 'Socket.IO instance not found' });
    }

    // Prepare alert payload
    const alertPayload = {
      reportId: report._id,
      farmerName: report.farmerName,
      location: report.location,
      pestType: report.pestType,
      alertMessage,
      severity,
      timestamp: new Date()
    };

    // Emit alert to all connected clients
    io.emit('new_alert', alertPayload);

    res.status(200).json({
      message: 'Alert broadcasted successfully',
      report,
      alert: alertPayload
    });
  } catch (error) {
    console.error('Error broadcasting alert:', error);
    res.status(500).json({ error: 'Failed to broadcast alert', details: error.message });
  }
});

module.exports = router;
