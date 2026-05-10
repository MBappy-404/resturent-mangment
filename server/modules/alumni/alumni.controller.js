const service = require('./alumni.service');

const getAlumni = async (req, res) => { try { const data = await service.getAlumni(req.query); res.json({ success: true, data: { alumni: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createAlumni = async (req, res) => { try { const data = await service.createAlumni(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateAlumni = async (req, res) => { try { const data = await service.updateAlumni(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteAlumni = async (req, res) => { try { await service.deleteAlumni(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

const getEvents = async (req, res) => { try { const data = await service.getEvents(); res.json({ success: true, data: { events: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createEvent = async (req, res) => { try { const data = await service.createEvent(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateEvent = async (req, res) => { try { const data = await service.updateEvent(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteEvent = async (req, res) => { try { await service.deleteEvent(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

module.exports = { getAlumni, createAlumni, updateAlumni, deleteAlumni, getEvents, createEvent, updateEvent, deleteEvent };
