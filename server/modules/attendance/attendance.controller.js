const attendanceService = require('./attendance.service');

const getAttendance = async (req, res) => {
  try {
    const data = await attendanceService.getAttendance(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const data = await attendanceService.getAttendanceById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const data = await attendanceService.markAttendance(req.body, req.user._id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const data = await attendanceService.getStudentAttendance(req.params.studentId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await attendanceService.getStats(req.query);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAttendance, getAttendanceById, markAttendance, getStudentAttendance, getStats };
