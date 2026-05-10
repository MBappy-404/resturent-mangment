const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const ctrl = require('./hostel.controller');

router.use(protect);
router.get('/rooms', ctrl.getRooms);
router.post('/rooms', roleCheck('super_admin', 'admin'), ctrl.createRoom);
router.put('/rooms/:id', roleCheck('super_admin', 'admin'), ctrl.updateRoom);
router.delete('/rooms/:id', roleCheck('super_admin', 'admin'), ctrl.deleteRoom);
router.get('/residents', ctrl.getResidents);
router.post('/residents', roleCheck('super_admin', 'admin'), ctrl.createResident);
router.put('/residents/:id', roleCheck('super_admin', 'admin'), ctrl.updateResident);
router.delete('/residents/:id', roleCheck('super_admin', 'admin'), ctrl.deleteResident);

module.exports = router;
