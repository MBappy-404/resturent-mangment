const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const {
  getRoutines, getRoutine, createRoutine, updateRoutine, deleteRoutine, bulkCreate
} = require('./classRoutine.controller');

router.use(protect);
router.get('/', getRoutines);
router.get('/:id', getRoutine);
router.post('/', roleCheck('super_admin', 'admin', 'head_teacher'), createRoutine);
router.post('/bulk', roleCheck('super_admin', 'admin', 'head_teacher'), bulkCreate);
router.put('/:id', roleCheck('super_admin', 'admin', 'head_teacher'), updateRoutine);
router.delete('/:id', roleCheck('super_admin', 'admin', 'head_teacher'), deleteRoutine);

module.exports = router;
