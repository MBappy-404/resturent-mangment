const { Vehicle, BusRoute, Driver } = require('./transport.model');

const getVehicles = async (query = {}) => { const f = {}; if (query.status) f.status = query.status; return Vehicle.find(f).sort('-createdAt'); };
const createVehicle = async (data, userId) => Vehicle.create({ ...data, createdBy: userId });
const updateVehicle = async (id, data) => { const v = await Vehicle.findByIdAndUpdate(id, data, { new: true }); if (!v) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return v; };
const deleteVehicle = async (id) => { const v = await Vehicle.findByIdAndDelete(id); if (!v) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return v; };

const getRoutes = async (query = {}) => BusRoute.find({}).sort('-createdAt');
const createRoute = async (data, userId) => BusRoute.create({ ...data, createdBy: userId });
const updateRoute = async (id, data) => { const r = await BusRoute.findByIdAndUpdate(id, data, { new: true }); if (!r) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return r; };
const deleteRoute = async (id) => { const r = await BusRoute.findByIdAndDelete(id); if (!r) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return r; };

const getDrivers = async (query = {}) => { const f = {}; if (query.status) f.status = query.status; return Driver.find(f).sort('-createdAt'); };
const createDriver = async (data, userId) => Driver.create({ ...data, createdBy: userId });
const updateDriver = async (id, data) => { const d = await Driver.findByIdAndUpdate(id, data, { new: true }); if (!d) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return d; };
const deleteDriver = async (id) => { const d = await Driver.findByIdAndDelete(id); if (!d) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return d; };

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle, getRoutes, createRoute, updateRoute, deleteRoute, getDrivers, createDriver, updateDriver, deleteDriver };
