const classRoutineService = require('./classRoutine.service');

const getRoutines = async (req, res) => {
  try {
    const routines = await classRoutineService.getRoutines(req.query);
    res.json({ success: true, data: routines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoutine = async (req, res) => {
  try {
    const routine = await classRoutineService.getRoutineById(req.params.id);
    res.json({ success: true, data: routine });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const createRoutine = async (req, res) => {
  try {
    const routine = await classRoutineService.createRoutine(req.body, req.user._id);
    res.status(201).json({ success: true, data: routine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRoutine = async (req, res) => {
  try {
    const routine = await classRoutineService.updateRoutine(req.params.id, req.body);
    res.json({ success: true, data: routine });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteRoutine = async (req, res) => {
  try {
    await classRoutineService.deleteRoutine(req.params.id);
    res.json({ success: true, message: 'Routine entry deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const bulkCreate = async (req, res) => {
  try {
    const routines = await classRoutineService.bulkCreateRoutines(req.body.routines, req.user._id);
    res.status(201).json({ success: true, data: routines, count: routines.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRoutines, getRoutine, createRoutine, updateRoutine, deleteRoutine, bulkCreate };
