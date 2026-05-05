const mongoose = require('mongoose');

const classRoutineSchema = new mongoose.Schema({
  className: { type: String, required: true },
  section: { type: String, required: true },
  day: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    required: true
  },
  periodNumber: { type: Number, required: true },
  periodName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  teacherName: { type: String, default: '' },
  room: { type: String, default: '' },
  type: { type: String, enum: ['class', 'break'], default: 'class' },
  session: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

classRoutineSchema.index({ className: 1, section: 1, day: 1, periodNumber: 1 }, { unique: true });

module.exports = mongoose.model('ClassRoutine', classRoutineSchema);
