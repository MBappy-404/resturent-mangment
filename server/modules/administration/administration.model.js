const mongoose = require('mongoose');

const administrationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameBn: { type: String, trim: true },
  designation: { type: String, required: true },
  designationBn: { type: String, default: '' },
  category: {
    type: String,
    enum: ['director', 'governing-body', 'committee'],
    required: true
  },
  committeeRole: { type: String, default: '' },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, default: '' },
  photo: { type: String, default: '' },
  bio: { type: String, default: '' },
  qualifications: { type: String, default: '' },
  occupation: { type: String, default: '' },
  occupationBn: { type: String, default: '' },
  appointmentDate: { type: Date, default: Date.now },
  tenureEnd: { type: Date },
  status: { type: String, enum: ['active', 'inactive', 'emeritus'], default: 'active' },
  responsibilities: [{ type: String }],
  achievements: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Administration', administrationSchema);
