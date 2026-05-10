const service = require('./scholarship.service');

const getPrograms = async (req, res) => { try { const data = await service.getPrograms(req.query); res.json({ success: true, data: { programs: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createProgram = async (req, res) => { try { const data = await service.createProgram(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateProgram = async (req, res) => { try { const data = await service.updateProgram(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteProgram = async (req, res) => { try { await service.deleteProgram(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

const getApplications = async (req, res) => { try { const data = await service.getApplications(req.query); res.json({ success: true, data: { applications: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createApplication = async (req, res) => { try { const data = await service.createApplication(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateApplication = async (req, res) => { try { const data = await service.updateApplication(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteApplication = async (req, res) => { try { await service.deleteApplication(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

module.exports = { getPrograms, createProgram, updateProgram, deleteProgram, getApplications, createApplication, updateApplication, deleteApplication };
