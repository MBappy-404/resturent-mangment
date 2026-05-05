const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const {
  getStudents, getStudent, createStudent, updateStudent, deleteStudent, getStats
} = require('./student.controller');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.post('/', roleCheck('super_admin', 'admin', 'head_teacher'), createStudent);
router.put('/:id', roleCheck('super_admin', 'admin', 'head_teacher'), updateStudent);
router.delete('/:id', roleCheck('super_admin', 'admin'), deleteStudent);

module.exports = router;
