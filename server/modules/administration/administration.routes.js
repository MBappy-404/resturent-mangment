const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const {
  getMembers, getMember, createMember, updateMember, deleteMember, getStats
} = require('./administration.controller');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', roleCheck('super_admin', 'admin'), createMember);
router.put('/:id', roleCheck('super_admin', 'admin'), updateMember);
router.delete('/:id', roleCheck('super_admin', 'admin'), deleteMember);

module.exports = router;
