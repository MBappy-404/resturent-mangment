const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const ctrl = require('./sms.controller');

router.use(protect);
router.get('/templates', ctrl.getTemplates);
router.post('/templates', roleCheck('super_admin', 'admin'), ctrl.createTemplate);
router.put('/templates/:id', roleCheck('super_admin', 'admin'), ctrl.updateTemplate);
router.delete('/templates/:id', roleCheck('super_admin', 'admin'), ctrl.deleteTemplate);
router.get('/history', ctrl.getHistory);
router.post('/send', roleCheck('super_admin', 'admin'), ctrl.sendSMS);

module.exports = router;
