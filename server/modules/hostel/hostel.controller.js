const service = require('./hostel.service');

const getRooms = async (req, res) => { try { const data = await service.getRooms(req.query); res.json({ success: true, data: { rooms: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createRoom = async (req, res) => { try { const data = await service.createRoom(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateRoom = async (req, res) => { try { const data = await service.updateRoom(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteRoom = async (req, res) => { try { await service.deleteRoom(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

const getResidents = async (req, res) => { try { const data = await service.getResidents(req.query); res.json({ success: true, data: { residents: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createResident = async (req, res) => { try { const data = await service.createResident(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateResident = async (req, res) => { try { const data = await service.updateResident(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteResident = async (req, res) => { try { await service.deleteResident(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

module.exports = { getRooms, createRoom, updateRoom, deleteRoom, getResidents, createResident, updateResident, deleteResident };
