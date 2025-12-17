import mongoose from 'mongoose';

const pestReportSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  pestType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ FIX: Use export default instead of module.exports
const PestReport = mongoose.model('PestReport', pestReportSchema);
export default PestReport;