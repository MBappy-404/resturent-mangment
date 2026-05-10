const service = require('./sms.service');

const getTemplates = async (req, res) => {
  try { const data = await service.getTemplates(req.query); res.json({ success: true, data: { templates: data } }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
const createTemplate = async (req, res) => {
  try { const data = await service.createTemplate(req.body, req.user._id); res.status(201).json({ success: true, data }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
const updateTemplate = async (req, res) => {
  try { const data = await service.updateTemplate(req.params.id, req.body); res.json({ success: true, data }); }
  catch (e) { res.status(e.statusCode || 500).json({ success: false, message: e.message }); }
};
const deleteTemplate = async (req, res) => {
  try { await service.deleteTemplate(req.params.id); res.json({ success: true, message: 'Deleted' }); }
  catch (e) { res.status(e.statusCode || 500).json({ success: false, message: e.message }); }
};
const getHistory = async (req, res) => {
  try { const data = await service.getHistory(req.query); res.json({ success: true, data: { history: data } }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
const sendSMS = async (req, res) => {
  try { const data = await service.sendSMS(req.body, req.user._id); res.status(201).json({ success: true, data }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getTemplates, createTemplate, updateTemplate, deleteTemplate, getHistory, sendSMS };
