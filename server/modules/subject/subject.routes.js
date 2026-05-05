const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const { getSubjects, getSubject, createSubject, updateSubject, deleteSubject } = require('./subject.controller');

router.use(protect);
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.post('/', roleCheck('super_admin', 'admin', 'head_teacher'), createSubject);
router.put('/:id', roleCheck('super_admin', 'admin', 'head_teacher'), updateSubject);
router.delete('/:id', roleCheck('super_admin', 'admin'), deleteSubject);

module.exports = router;
