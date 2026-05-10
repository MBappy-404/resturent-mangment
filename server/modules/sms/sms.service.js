const { SMSTemplate, SMSHistory } = require('./sms.model');

const getTemplates = async (query = {}) => {
  const filter = {};
  if (query.type) filter.type = query.type;
  return SMSTemplate.find(filter).sort('-createdAt');
};
const createTemplate = async (data, userId) => SMSTemplate.create({ ...data, createdBy: userId });
const updateTemplate = async (id, data) => {
  const t = await SMSTemplate.findByIdAndUpdate(id, data, { new: true });
  if (!t) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
  return t;
};
const deleteTemplate = async (id) => {
  const t = await SMSTemplate.findByIdAndDelete(id);
  if (!t) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
  return t;
};
const getHistory = async (query = {}) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  return SMSHistory.find(filter).sort('-createdAt');
};
const sendSMS = async (data, userId) => SMSHistory.create({ ...data, createdBy: userId });

module.exports = { getTemplates, createTemplate, updateTemplate, deleteTemplate, getHistory, sendSMS };
