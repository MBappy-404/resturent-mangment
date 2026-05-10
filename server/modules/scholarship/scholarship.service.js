const { ScholarshipProgram, ScholarshipApplication } = require('./scholarship.model');

const getPrograms = async (query = {}) => { const f = {}; if (query.status) f.status = query.status; return ScholarshipProgram.find(f).sort('-createdAt'); };
const createProgram = async (data, userId) => ScholarshipProgram.create({ ...data, createdBy: userId });
const updateProgram = async (id, data) => { const p = await ScholarshipProgram.findByIdAndUpdate(id, data, { new: true }); if (!p) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return p; };
const deleteProgram = async (id) => { const p = await ScholarshipProgram.findByIdAndDelete(id); if (!p) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return p; };

const getApplications = async (query = {}) => { const f = {}; if (query.status) f.status = query.status; if (query.programId) f.programId = query.programId; return ScholarshipApplication.find(f).sort('-createdAt'); };
const createApplication = async (data, userId) => ScholarshipApplication.create({ ...data, createdBy: userId });
const updateApplication = async (id, data) => { const a = await ScholarshipApplication.findByIdAndUpdate(id, data, { new: true }); if (!a) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return a; };
const deleteApplication = async (id) => { const a = await ScholarshipApplication.findByIdAndDelete(id); if (!a) { const e = new Error('Not found'); e.statusCode = 404; throw e; } return a; };

module.exports = { getPrograms, createProgram, updateProgram, deleteProgram, getApplications, createApplication, updateApplication, deleteApplication };
