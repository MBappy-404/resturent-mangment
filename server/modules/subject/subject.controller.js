const subjectService = require('./subject.service');

const getSubjects = async (req, res) => {
  try {
    const data = await subjectService.getAll(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSubject = async (req, res) => {
  try {
    const data = await subjectService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const data = await subjectService.create(req.body, req.user._id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const data = await subjectService.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    await subjectService.remove(req.params.id);
    res.json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getSubjects, getSubject, createSubject, updateSubject, deleteSubject };
