const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  passingYear: { type: String, required: true },
  class: { type: String, default: '' },
  currentProfession: { type: String, default: '' },
  company: { type: String, default: '' },
  designation: { type: String, default: '' },
  address: { type: String, default: '' },
  achievements: { type: String, default: '' },
  photo: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const alumniEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleBn: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  time: { type: String, default: '' },
  venue: { type: String, default: '' },
  organizer: { type: String, default: '' },
  expectedAttendees: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Alumni = mongoose.model('Alumni', alumniSchema);
const AlumniEvent = mongoose.model('AlumniEvent', alumniEventSchema);

module.exports = { Alumni, AlumniEvent };
