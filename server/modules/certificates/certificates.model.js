const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  type: { type: String, enum: ['transfer', 'character', 'bonafide', 'testimonial'], required: true },
  studentName: { type: String, required: true },
  studentNameBn: { type: String, default: '' },
  studentId: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  issueDate: { type: Date, default: Date.now },
  reason: { type: String, default: '' },
  remarks: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'printed'], default: 'pending' },
  serialNo: { type: String, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const certificateTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  type: { type: String, enum: ['transfer', 'character', 'bonafide', 'testimonial'], required: true },
  content: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
const CertificateTemplate = mongoose.model('CertificateTemplate', certificateTemplateSchema);

module.exports = { Certificate, CertificateTemplate };
