const mongoose = require('mongoose');

const scholarshipProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  description: { type: String, default: '' },
  amount: { type: Number, required: true },
  eligibility: { type: String, default: '' },
  deadline: { type: Date },
  totalSlots: { type: Number, default: 0 },
  filledSlots: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'closed', 'upcoming'], default: 'active' },
  sponsor: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const scholarshipApplicationSchema = new mongoose.Schema({
  programId: { type: String, default: '' },
  programName: { type: String, default: '' },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentNameBn: { type: String, default: '' },
  class: { type: String, default: '' },
  gpa: { type: String, default: '' },
  familyIncome: { type: String, default: '' },
  reason: { type: String, default: '' },
  appliedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remarks: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const ScholarshipProgram = mongoose.model('ScholarshipProgram', scholarshipProgramSchema);
const ScholarshipApplication = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);

module.exports = { ScholarshipProgram, ScholarshipApplication };
