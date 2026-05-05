const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const {
  getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher, getStats
} = require('./teacher.controller');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getTeachers);
router.get('/:id', getTeacher);
router.post('/', roleCheck('super_admin', 'admin', 'head_teacher'), createTeacher);
router.put('/:id', roleCheck('super_admin', 'admin', 'head_teacher'), updateTeacher);
router.delete('/:id', roleCheck('super_admin', 'admin'), deleteTeacher);

module.exports = router;
