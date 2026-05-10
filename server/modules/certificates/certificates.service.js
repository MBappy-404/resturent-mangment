const { Certificate, CertificateTemplate } = require('./certificates.model');

const getCertificates = async (query = {}) => { const f = {}; if (query.type) f.type = query.type; if (query.status) f.status = query.status; return Certificate.find(f).sort('-createdAt'); };
const createCertificate = async (data, userId) => Certificate.create({ ...data, createdBy: userId });
const updateCertificate = async (id, data) => { const c = await Certificate.findByIdAndUpdate(id, data, { new: true }); if (!c) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return c; };
const deleteCertificate = async (id) => { const c = await Certificate.findByIdAndDelete(id); if (!c) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return c; };

const getTemplates = async () => CertificateTemplate.find({}).sort('-createdAt');
const createTemplate = async (data, userId) => CertificateTemplate.create({ ...data, createdBy: userId });
const updateTemplate = async (id, data) => { const t = await CertificateTemplate.findByIdAndUpdate(id, data, { new: true }); if (!t) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return t; };
const deleteTemplate = async (id) => { const t = await CertificateTemplate.findByIdAndDelete(id); if (!t) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return t; };

module.exports = { getCertificates, createCertificate, updateCertificate, deleteCertificate, getTemplates, createTemplate, updateTemplate, deleteTemplate };
