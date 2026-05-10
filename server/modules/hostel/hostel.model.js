const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  floor: { type: String, default: '' },
  type: { type: String, enum: ['single', 'double', 'dormitory'], default: 'double' },
  capacity: { type: Number, default: 2 },
  occupied: { type: Number, default: 0 },
  monthlyRent: { type: Number, default: 0 },
  amenities: { type: String, default: '' },
  status: { type: String, enum: ['available', 'full', 'maintenance'], default: 'available' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const hostelResidentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentNameBn: { type: String, default: '' },
  class: { type: String, default: '' },
  roomId: { type: String, default: '' },
  roomNumber: { type: String, default: '' },
  bedNumber: { type: String, default: '' },
  joinDate: { type: Date, default: Date.now },
  guardianName: { type: String, default: '' },
  guardianPhone: { type: String, default: '' },
  mealPlan: { type: String, enum: ['full', 'partial', 'none'], default: 'full' },
  monthlyFee: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
const HostelResident = mongoose.model('HostelResident', hostelResidentSchema);

module.exports = { Room, HostelResident };
