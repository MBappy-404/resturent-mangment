const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const ctrl = require('./alumni.controller');

router.use(protect);
router.get('/', ctrl.getAlumni);
router.post('/', roleCheck('super_admin', 'admin'), ctrl.createAlumni);
router.put('/:id', roleCheck('super_admin', 'admin'), ctrl.updateAlumni);
router.delete('/:id', roleCheck('super_admin', 'admin'), ctrl.deleteAlumni);
router.get('/events', ctrl.getEvents);
router.post('/events', roleCheck('super_admin', 'admin'), ctrl.createEvent);
router.put('/events/:id', roleCheck('super_admin', 'admin'), ctrl.updateEvent);
router.delete('/events/:id', roleCheck('super_admin', 'admin'), ctrl.deleteEvent);

module.exports = router;
