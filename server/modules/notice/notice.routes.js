const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const { getNotices, getNotice, createNotice, updateNotice, deleteNotice } = require('./notice.controller');

router.use(protect);
router.get('/', getNotices);
router.get('/:id', getNotice);
router.post('/', roleCheck('super_admin', 'admin', 'head_teacher'), createNotice);
router.put('/:id', roleCheck('super_admin', 'admin', 'head_teacher'), updateNotice);
router.delete('/:id', roleCheck('super_admin', 'admin'), deleteNotice);

module.exports = router;
