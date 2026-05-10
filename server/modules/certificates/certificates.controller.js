const service = require('./certificates.service');

const getCertificates = async (req, res) => { try { const data = await service.getCertificates(req.query); res.json({ success: true, data: { certificates: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createCertificate = async (req, res) => { try { const data = await service.createCertificate(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateCertificate = async (req, res) => { try { const data = await service.updateCertificate(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteCertificate = async (req, res) => { try { await service.deleteCertificate(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

const getTemplates = async (req, res) => { try { const data = await service.getTemplates(); res.json({ success: true, data: { templates: data } }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const createTemplate = async (req, res) => { try { const data = await service.createTemplate(req.body, req.user._id); res.status(201).json({ success: true, data }); } catch(e) { res.status(500).json({ success: false, message: e.message }); } };
const updateTemplate = async (req, res) => { try { const data = await service.updateTemplate(req.params.id, req.body); res.json({ success: true, data }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };
const deleteTemplate = async (req, res) => { try { await service.deleteTemplate(req.params.id); res.json({ success: true, message: 'Deleted' }); } catch(e) { res.status(e.statusCode||500).json({ success: false, message: e.message }); } };

module.exports = { getCertificates, createCertificate, updateCertificate, deleteCertificate, getTemplates, createTemplate, updateTemplate, deleteTemplate };
