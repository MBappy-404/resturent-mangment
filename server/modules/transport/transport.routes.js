const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const ctrl = require('./transport.controller');

router.use(protect);
router.get('/vehicles', ctrl.getVehicles);
router.post('/vehicles', roleCheck('super_admin', 'admin'), ctrl.createVehicle);
router.put('/vehicles/:id', roleCheck('super_admin', 'admin'), ctrl.updateVehicle);
router.delete('/vehicles/:id', roleCheck('super_admin', 'admin'), ctrl.deleteVehicle);
router.get('/routes', ctrl.getRoutes);
router.post('/routes', roleCheck('super_admin', 'admin'), ctrl.createRoute);
router.put('/routes/:id', roleCheck('super_admin', 'admin'), ctrl.updateRoute);
router.delete('/routes/:id', roleCheck('super_admin', 'admin'), ctrl.deleteRoute);
router.get('/drivers', ctrl.getDrivers);
router.post('/drivers', roleCheck('super_admin', 'admin'), ctrl.createDriver);
router.put('/drivers/:id', roleCheck('super_admin', 'admin'), ctrl.updateDriver);
router.delete('/drivers/:id', roleCheck('super_admin', 'admin'), ctrl.deleteDriver);

module.exports = router;
