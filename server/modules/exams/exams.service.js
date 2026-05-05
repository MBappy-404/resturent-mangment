const { Exam, ExamSchedule, ExamResult } = require('./exams.model');

const getExams = async (query = {}) => {
  const filter = {};
  if (query.className) filter.className = query.className;
  if (query.examType) filter.examType = query.examType;
  if (query.status) filter.status = query.status;
  if (query.session) filter.session = query.session;
  return Exam.find(filter).sort('-startDate');
};

const getExamById = async (id) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    const error = new Error('Exam not found');
    error.statusCode = 404;
    throw error;
  }
  return exam;
};

const createExam = async (data, userId) => {
  return Exam.create({ ...data, createdBy: userId });
};

const updateExam = async (id, data) => {
  const exam = await Exam.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!exam) {
    const error = new Error('Exam not found');
    error.statusCode = 404;
    throw error;
  }
  return exam;
};

const deleteExam = async (id) => {
  const exam = await Exam.findByIdAndDelete(id);
  if (!exam) {
    const error = new Error('Exam not found');
    error.statusCode = 404;
    throw error;
  }
  await ExamSchedule.deleteMany({ exam: id });
  await ExamResult.deleteMany({ exam: id });
  return exam;
};

const getSchedules = async (examId) => {
  return ExamSchedule.find({ exam: examId }).populate('invigilator', 'name').sort('date startTime');
};

const createSchedule = async (data) => {
  return ExamSchedule.create(data);
};

const updateSchedule = async (id, data) => {
  return ExamSchedule.findByIdAndUpdate(id, data, { new: true });
};

const deleteSchedule = async (id) => {
  return ExamSchedule.findByIdAndDelete(id);
};

const getResults = async (query = {}) => {
  const filter = {};
  if (query.exam) filter.exam = query.exam;
  if (query.student) filter.student = query.student;
  if (query.subject) filter.subject = query.subject;
  return ExamResult.find(filter)
    .populate('student', 'name studentId roll className section')
    .populate('exam', 'name examType')
    .sort('subject student');
};

const addResult = async (data, userId) => {
  return ExamResult.create({ ...data, enteredBy: userId });
};

const addBulkResults = async (results, userId) => {
  const entries = results.map(r => ({ ...r, enteredBy: userId }));
  return ExamResult.insertMany(entries);
};

const updateResult = async (id, data) => {
  return ExamResult.findByIdAndUpdate(id, data, { new: true });
};

const calculateGrade = (marks, total) => {
  const percentage = (marks / total) * 100;
  if (percentage >= 80) return { grade: 'A+', gradePoint: 5.0 };
  if (percentage >= 70) return { grade: 'A', gradePoint: 4.0 };
  if (percentage >= 60) return { grade: 'A-', gradePoint: 3.5 };
  if (percentage >= 50) return { grade: 'B', gradePoint: 3.0 };
  if (percentage >= 40) return { grade: 'C', gradePoint: 2.0 };
  if (percentage >= 33) return { grade: 'D', gradePoint: 1.0 };
  return { grade: 'F', gradePoint: 0.0 };
};

module.exports = {
  getExams, getExamById, createExam, updateExam, deleteExam,
  getSchedules, createSchedule, updateSchedule, deleteSchedule,
  getResults, addResult, addBulkResults, updateResult, calculateGrade
};
