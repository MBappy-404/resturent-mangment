const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const {
  getStaff, getStaffMember, createStaff, updateStaff, deleteStaff, getStats
} = require('./staff.controller');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getStaff);
router.get('/:id', getStaffMember);
router.post('/', roleCheck('super_admin', 'admin'), createStaff);
router.put('/:id', roleCheck('super_admin', 'admin'), updateStaff);
router.delete('/:id', roleCheck('super_admin', 'admin'), deleteStaff);

module.exports = router;
