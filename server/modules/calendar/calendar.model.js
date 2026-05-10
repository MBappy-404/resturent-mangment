const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleBn: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  endDate: { type: Date },
  time: { type: String, default: '' },
  type: { type: String, enum: ['holiday', 'exam', 'event', 'meeting', 'other'], default: 'other' },
  location: { type: String, default: '' },
  participants: { type: String, default: '' },
  isImportant: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
