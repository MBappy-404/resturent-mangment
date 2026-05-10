const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const ctrl = require('./scholarship.controller');

router.use(protect);
router.get('/programs', ctrl.getPrograms);
router.post('/programs', roleCheck('super_admin', 'admin'), ctrl.createProgram);
router.put('/programs/:id', roleCheck('super_admin', 'admin'), ctrl.updateProgram);
router.delete('/programs/:id', roleCheck('super_admin', 'admin'), ctrl.deleteProgram);
router.get('/applications', ctrl.getApplications);
router.post('/applications', roleCheck('super_admin', 'admin'), ctrl.createApplication);
router.put('/applications/:id', roleCheck('super_admin', 'admin'), ctrl.updateApplication);
router.delete('/applications/:id', roleCheck('super_admin', 'admin'), ctrl.deleteApplication);

module.exports = router;
