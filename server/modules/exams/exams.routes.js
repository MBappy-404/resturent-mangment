const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const {
  getExams, getExam, createExam, updateExam, deleteExam,
  getSchedules, createSchedule, getResults, addResult, addBulkResults
} = require('./exams.controller');

router.use(protect);
router.get('/', getExams);
router.get('/:id', getExam);
router.post('/', roleCheck('super_admin', 'admin', 'head_teacher'), createExam);
router.put('/:id', roleCheck('super_admin', 'admin', 'head_teacher'), updateExam);
router.delete('/:id', roleCheck('super_admin', 'admin'), deleteExam);
router.get('/:examId/schedules', getSchedules);
router.post('/:examId/schedules', roleCheck('super_admin', 'admin', 'head_teacher'), createSchedule);
router.get('/results/all', getResults);
router.post('/results', roleCheck('super_admin', 'admin', 'head_teacher', 'teacher'), addResult);
router.post('/results/bulk', roleCheck('super_admin', 'admin', 'head_teacher'), addBulkResults);

module.exports = router;
