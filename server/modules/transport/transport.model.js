const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  number: { type: String, required: true },
  type: { type: String, enum: ['bus', 'microbus', 'van'], default: 'bus' },
  capacity: { type: Number, default: 40 },
  driver: { type: String, default: '' },
  driverPhone: { type: String, default: '' },
  helper: { type: String, default: '' },
  route: { type: String, default: '' },
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const busRouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  stops: [{ type: String }],
  vehicleId: { type: String, default: '' },
  departureTime: { type: String, default: '' },
  returnTime: { type: String, default: '' },
  students: { type: Number, default: 0 },
  fee: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  phone: { type: String, default: '' },
  license: { type: String, default: '' },
  address: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const BusRoute = mongoose.model('BusRoute', busRouteSchema);
const Driver = mongoose.model('Driver', driverSchema);

module.exports = { Vehicle, BusRoute, Driver };
