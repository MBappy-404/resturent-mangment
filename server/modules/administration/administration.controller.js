const adminService = require('./administration.service');

const getMembers = async (req, res) => {
  try {
    const data = await adminService.getAll(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMember = async (req, res) => {
  try {
    const member = await adminService.getById(req.params.id);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const member = await adminService.create(req.body, req.user._id);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await adminService.update(req.params.id, req.body);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    await adminService.remove(req.params.id);
    res.json({ success: true, message: 'Administration member removed' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await adminService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMembers, getMember, createMember, updateMember, deleteMember, getStats };
