const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'leave'], default: 'present' },
  note: { type: String, default: '' }
});

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  records: [attendanceRecordSchema],
  totalPresent: { type: Number, default: 0 },
  totalAbsent: { type: Number, default: 0 },
  totalLate: { type: Number, default: 0 },
  totalLeave: { type: Number, default: 0 },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

attendanceSchema.index({ date: 1, className: 1, section: 1 }, { unique: true });

attendanceSchema.pre('save', function (next) {
  this.totalPresent = this.records.filter(r => r.status === 'present').length;
  this.totalAbsent = this.records.filter(r => r.status === 'absent').length;
  this.totalLate = this.records.filter(r => r.status === 'late').length;
  this.totalLeave = this.records.filter(r => r.status === 'leave').length;
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
