const service = require('./transport.service');

const getVehicles = async (req, res) => { try { const data = await service.getVehicles(req.query); res.json({ success: true, data: { vehicles: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createVehicle = async (req, res) => { try { const data = await service.createVehicle(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateVehicle = async (req, res) => { try { const data = await service.updateVehicle(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteVehicle = async (req, res) => { try { await service.deleteVehicle(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

const getRoutes = async (req, res) => { try { const data = await service.getRoutes(req.query); res.json({ success: true, data: { routes: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createRoute = async (req, res) => { try { const data = await service.createRoute(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateRoute = async (req, res) => { try { const data = await service.updateRoute(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteRoute = async (req, res) => { try { await service.deleteRoute(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

const getDrivers = async (req, res) => { try { const data = await service.getDrivers(req.query); res.json({ success: true, data: { drivers: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createDriver = async (req, res) => { try { const data = await service.createDriver(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateDriver = async (req, res) => { try { const data = await service.updateDriver(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteDriver = async (req, res) => { try { await service.deleteDriver(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle, getRoutes, createRoute, updateRoute, deleteRoute, getDrivers, createDriver, updateDriver, deleteDriver };
