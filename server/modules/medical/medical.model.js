const mongoose = require('mongoose');

const medicalSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentNameBn: { type: String, default: '' },
  class: { type: String, default: '' },
  section: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  height: { type: String, default: '' },
  weight: { type: String, default: '' },
  allergies: { type: String, default: 'None' },
  chronicConditions: { type: String, default: 'None' },
  currentMedications: { type: String, default: 'None' },
  emergencyContact: { type: String, default: '' },
  emergencyPhone: { type: String, default: '' },
  emergencyRelation: { type: String, default: '' },
  doctorName: { type: String, default: '' },
  doctorPhone: { type: String, default: '' },
  lastCheckup: { type: Date },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['healthy', 'needs-attention', 'critical'], default: 'healthy' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Medical', medicalSchema);
