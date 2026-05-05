const feesService = require('./fees.service');

const getFeeStructures = async (req, res) => {
  try {
    const data = await feesService.getFeeStructures(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFeeStructure = async (req, res) => {
  try {
    const data = await feesService.createFeeStructure(req.body, req.user._id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFeeStructure = async (req, res) => {
  try {
    const data = await feesService.updateFeeStructure(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteFeeStructure = async (req, res) => {
  try {
    await feesService.deleteFeeStructure(req.params.id);
    res.json({ success: true, message: 'Fee structure deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const data = await feesService.getPayments(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const collectFee = async (req, res) => {
  try {
    const data = await feesService.collectFee(req.body, req.user._id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const data = await feesService.updatePayment(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await feesService.getStats(req.query);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure, getPayments, collectFee, updatePayment, getStats };
