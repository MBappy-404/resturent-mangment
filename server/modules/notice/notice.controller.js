const noticeService = require('./notice.service');

const getNotices = async (req, res) => {
  try {
    const data = await noticeService.getAll(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotice = async (req, res) => {
  try {
    const data = await noticeService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const createNotice = async (req, res) => {
  try {
    const data = await noticeService.create(req.body, req.user._id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const data = await noticeService.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    await noticeService.remove(req.params.id);
    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotices, getNotice, createNotice, updateNotice, deleteNotice };
