const staffService = require('./staff.service');

const getStaff = async (req, res) => {
  try {
    const data = await staffService.getAllStaff(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStaffMember = async (req, res) => {
  try {
    const staff = await staffService.getStaffById(req.params.id);
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const staff = await staffService.createStaff(req.body, req.user._id);
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const staff = await staffService.updateStaff(req.params.id, req.body);
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    await staffService.deleteStaff(req.params.id);
    res.json({ success: true, message: 'Staff member deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await staffService.getStaffStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStaff, getStaffMember, createStaff, updateStaff, deleteStaff, getStats };
