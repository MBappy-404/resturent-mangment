const examService = require('./exams.service');

const getExams = async (req, res) => {
  try {
    const data = await examService.getExams(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExam = async (req, res) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const createExam = async (req, res) => {
  try {
    const exam = await examService.createExam(req.body, req.user._id);
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await examService.updateExam(req.params.id, req.body);
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    await examService.deleteExam(req.params.id);
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getSchedules = async (req, res) => {
  try {
    const data = await examService.getSchedules(req.params.examId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSchedule = async (req, res) => {
  try {
    const data = await examService.createSchedule(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getResults = async (req, res) => {
  try {
    const data = await examService.getResults(req.query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addResult = async (req, res) => {
  try {
    const data = await examService.addResult(req.body, req.user._id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addBulkResults = async (req, res) => {
  try {
    const data = await examService.addBulkResults(req.body.results, req.user._id);
    res.status(201).json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getExams, getExam, createExam, updateExam, deleteExam, getSchedules, createSchedule, getResults, addResult, addBulkResults };
