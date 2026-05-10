const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const ctrl = require('./certificates.controller');

router.use(protect);
router.get('/', ctrl.getCertificates);
router.post('/', roleCheck('super_admin', 'admin'), ctrl.createCertificate);
router.put('/:id', roleCheck('super_admin', 'admin'), ctrl.updateCertificate);
router.delete('/:id', roleCheck('super_admin', 'admin'), ctrl.deleteCertificate);
router.get('/templates', ctrl.getTemplates);
router.post('/templates', roleCheck('super_admin', 'admin'), ctrl.createTemplate);
router.put('/templates/:id', roleCheck('super_admin', 'admin'), ctrl.updateTemplate);
router.delete('/templates/:id', roleCheck('super_admin', 'admin'), ctrl.deleteTemplate);

module.exports = router;
