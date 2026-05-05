const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
  getAttendance, getAttendanceById, markAttendance, getStudentAttendance, getStats
} = require('./attendance.controller');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getAttendance);
router.get('/:id', getAttendanceById);
router.post('/', markAttendance);
router.get('/student/:studentId', getStudentAttendance);

module.exports = router;
