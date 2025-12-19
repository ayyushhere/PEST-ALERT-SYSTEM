import express from 'express';
import multer from 'multer';
import path from 'path';
import PestReport from '../models/PestReport.js'; // ✅ Added .js
import { protect, admin } from '../middleware/authMiddleware.js'; // ✅ Added .js

const router = express.Router();

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this folder exists in your root directory!
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pest-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

// --- ROUTES ---

// 1. Create Report (Farmer) - Protected
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { location, pestType, description } = req.body;
    
    // Auto-fill farmerName from the logged-in user token
    const farmerName = req.user.name; 

    if (!req.file) return res.status(400).json({ error: 'Image file is required' });
    if (!location || !pestType || !description) return res.status(400).json({ error: 'All fields are required' });

    const newReport = new PestReport({
      farmerName, 
      location,
      pestType,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
      status: 'Pending'
    });

    await newReport.save();
    res.status(201).json({ message: 'Report submitted', report: newReport });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report', details: error.message });
  }
});

router.get('/myreports', protect, async (req, res) => {
  try {
    // We find reports where 'farmerName' matches the logged-in user's name
    // (Ideally we should use user ID, but name works for now based on your schema)
    const reports = await PestReport.find({ farmerName: req.user.name }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your reports' });
  }
});

// 2. Get All Reports - Protected + Admin Only
router.get('/', protect, admin, async (req, res) => {
  try {
    const reports = await PestReport.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// 3. Update Status - Protected + Admin Only
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await PestReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: 'Status updated', report });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// 4. Broadcast Alert - Protected + Admin Only
router.post('/broadcast', protect, admin, async (req, res) => {
  try {
    const { reportId, alertMessage, severity, imageUrl } = req.body; // <--- Changed: Extract imageUrl from body
    
    const report = await PestReport.findByIdAndUpdate(
      reportId,
      { status: 'Resolved' },
      { new: true }
    );

    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Ensure you have set 'socketio' in your server.js for this to work
    const io = req.app.get('socketio');
    
    const alertPayload = {
      reportId: report._id,
      farmerName: report.farmerName,
      location: report.location,
      pestType: report.pestType,
      alertMessage,
      severity,
      imageUrl: imageUrl || report.imageUrl, // <--- Changed: Use body image (formatted) or fallback to DB
      timestamp: new Date()
    };

    // Check if io exists before emitting to prevent crashes
    if (io) {
        io.emit('new_alert', alertPayload);
    } else {
        console.warn("Socket.io not initialized, alert saved but not broadcasted.");
    }

    res.status(200).json({ message: 'Alert broadcasted', alert: alertPayload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Broadcast failed' });
  }
});

export default router; // ✅ Correct export syntax