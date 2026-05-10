const { Alumni, AlumniEvent } = require('./alumni.model');

const getAlumni = async (query = {}) => { const f = {}; if (query.passingYear) f.passingYear = query.passingYear; if (query.status) f.status = query.status; if (query.search) f.$or = [{ name: { $regex: query.search, $options: 'i' } }, { nameBn: { $regex: query.search, $options: 'i' } }]; return Alumni.find(f).sort('-createdAt'); };
const createAlumni = async (data, userId) => Alumni.create({ ...data, createdBy: userId });
const updateAlumni = async (id, data) => { const a = await Alumni.findByIdAndUpdate(id, data, { new: true }); if (!a) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return a; };
const deleteAlumni = async (id) => { const a = await Alumni.findByIdAndDelete(id); if (!a) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return a; };

const getEvents = async () => AlumniEvent.find({}).sort('-date');
const createEvent = async (data, userId) => AlumniEvent.create({ ...data, createdBy: userId });
const updateEvent = async (id, data) => { const e2 = await AlumniEvent.findByIdAndUpdate(id, data, { new: true }); if (!e2) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return e2; };
const deleteEvent = async (id) => { const e2 = await AlumniEvent.findByIdAndDelete(id); if (!e2) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return e2; };

module.exports = { getAlumni, createAlumni, updateAlumni, deleteAlumni, getEvents, createEvent, updateEvent, deleteEvent };
