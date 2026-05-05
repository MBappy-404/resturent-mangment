const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  code: { type: String, unique: true },
  className: { type: String, required: true },
  type: { type: String, enum: ['compulsory', 'optional', 'elective'], default: 'compulsory' },
  totalMarks: { type: Number, default: 100 },
  passMarks: { type: Number, default: 33 },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
