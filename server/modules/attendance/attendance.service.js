const Attendance = require('./attendance.model');

const getAttendance = async (query = {}) => {
  const filter = {};
  if (query.className) filter.className = query.className;
  if (query.section) filter.section = query.section;
  if (query.date) {
    const d = new Date(query.date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    filter.date = { $gte: d, $lt: next };
  }
  if (query.startDate && query.endDate) {
    filter.date = { $gte: new Date(query.startDate), $lte: new Date(query.endDate) };
  }

  return Attendance.find(filter).populate('records.student', 'name studentId roll').sort('-date');
};

const getAttendanceById = async (id) => {
  const attendance = await Attendance.findById(id).populate('records.student', 'name studentId roll');
  if (!attendance) {
    const error = new Error('Attendance record not found');
    error.statusCode = 404;
    throw error;
  }
  return attendance;
};

const markAttendance = async (data, userId) => {
  const { date, className, section, records } = data;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({ date: d, className, section });
  if (attendance) {
    attendance.records = records;
    attendance.markedBy = userId;
    await attendance.save();
  } else {
    attendance = await Attendance.create({ date: d, className, section, records, markedBy: userId });
  }
  return attendance;
};

const getStudentAttendance = async (studentId, query = {}) => {
  const filter = { 'records.student': studentId };
  if (query.startDate && query.endDate) {
    filter.date = { $gte: new Date(query.startDate), $lte: new Date(query.endDate) };
  }

  const records = await Attendance.find(filter).sort('-date');
  const summary = { total: 0, present: 0, absent: 0, late: 0, leave: 0 };
  records.forEach(att => {
    const rec = att.records.find(r => r.student.toString() === studentId);
    if (rec) {
      summary.total++;
      summary[rec.status]++;
    }
  });
  return { records, summary };
};

const getStats = async (query = {}) => {
  const filter = {};
  if (query.className) filter.className = query.className;
  if (query.date) {
    const d = new Date(query.date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    filter.date = { $gte: d, $lt: next };
  }

  const result = await Attendance.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalPresent: { $sum: '$totalPresent' },
        totalAbsent: { $sum: '$totalAbsent' },
        totalLate: { $sum: '$totalLate' },
        totalLeave: { $sum: '$totalLeave' }
      }
    }
  ]);

  return result[0] || { totalPresent: 0, totalAbsent: 0, totalLate: 0, totalLeave: 0 };
};

module.exports = { getAttendance, getAttendanceById, markAttendance, getStudentAttendance, getStats };
