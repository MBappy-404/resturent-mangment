const service = require('./accounts.service');

const getAll = async (req, res) => {
  try {
    const data = await service.getAll(req.query);
    res.json({ success: true, data: { transactions: data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await service.create(req.body, req.user._id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
