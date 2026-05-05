const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const {
  getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure,
  getPayments, collectFee, updatePayment, getStats
} = require('./fees.controller');

router.use(protect);
router.get('/stats', getStats);
router.get('/structures', getFeeStructures);
router.post('/structures', roleCheck('super_admin', 'admin', 'accountant'), createFeeStructure);
router.put('/structures/:id', roleCheck('super_admin', 'admin', 'accountant'), updateFeeStructure);
router.delete('/structures/:id', roleCheck('super_admin', 'admin'), deleteFeeStructure);
router.get('/payments', getPayments);
router.post('/payments', roleCheck('super_admin', 'admin', 'accountant'), collectFee);
router.put('/payments/:id', roleCheck('super_admin', 'admin', 'accountant'), updatePayment);

module.exports = router;
