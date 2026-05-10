const { Room, HostelResident } = require('./hostel.model');

const getRooms = async (query = {}) => { const f = {}; if (query.status) f.status = query.status; if (query.type) f.type = query.type; return Room.find(f).sort('roomNumber'); };
const createRoom = async (data, userId) => Room.create({ ...data, createdBy: userId });
const updateRoom = async (id, data) => { const r = await Room.findByIdAndUpdate(id, data, { new: true }); if (!r) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return r; };
const deleteRoom = async (id) => { const r = await Room.findByIdAndDelete(id); if (!r) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return r; };

const getResidents = async (query = {}) => { const f = {}; if (query.status) f.status = query.status; if (query.search) f.$or = [{ studentName: { $regex: query.search, $options: 'i' } }]; return HostelResident.find(f).sort('-createdAt'); };
const createResident = async (data, userId) => HostelResident.create({ ...data, createdBy: userId });
const updateResident = async (id, data) => { const r = await HostelResident.findByIdAndUpdate(id, data, { new: true }); if (!r) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return r; };
const deleteResident = async (id) => { const r = await HostelResident.findByIdAndDelete(id); if (!r) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return r; };

module.exports = { getRooms, createRoom, updateRoom, deleteRoom, getResidents, createResident, updateResident, deleteResident };
