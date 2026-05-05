const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  examType: {
    type: String,
    enum: ['class-test', 'weekly', 'monthly', 'mid-term', 'final', 'model-test', 'pre-test'],
    required: true
  },
  className: { type: String, required: true },
  section: { type: String },
  session: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  totalMarks: { type: Number, default: 100 },
  passMarks: { type: Number, default: 33 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const examScheduleSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, default: '' },
  totalMarks: { type: Number, default: 100 },
  invigilator: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

const examResultSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  obtainedMarks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, default: '' },
  gradePoint: { type: Number, default: 0 },
  remarks: { type: String, default: '' },
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

examResultSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

const Exam = mongoose.model('Exam', examSchema);
const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);
const ExamResult = mongoose.model('ExamResult', examResultSchema);

module.exports = { Exam, ExamSchedule, ExamResult };
