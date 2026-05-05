const ClassRoutine = require('./classRoutine.model');

const getRoutines = async (query = {}) => {
  const filter = {};
  if (query.className) filter.className = query.className;
  if (query.section) filter.section = query.section;
  if (query.day) filter.day = query.day;
  if (query.session) filter.session = query.session;

  return ClassRoutine.find(filter).populate('teacher', 'name nameBn').sort({ day: 1, periodNumber: 1 });
};

const getRoutineById = async (id) => {
  const routine = await ClassRoutine.findById(id).populate('teacher', 'name nameBn');
  if (!routine) {
    const error = new Error('Routine entry not found');
    error.statusCode = 404;
    throw error;
  }
  return routine;
};

const createRoutine = async (data, userId) => {
  return ClassRoutine.create({ ...data, createdBy: userId });
};

const updateRoutine = async (id, data) => {
  const routine = await ClassRoutine.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!routine) {
    const error = new Error('Routine entry not found');
    error.statusCode = 404;
    throw error;
  }
  return routine;
};

const deleteRoutine = async (id) => {
  const routine = await ClassRoutine.findByIdAndDelete(id);
  if (!routine) {
    const error = new Error('Routine entry not found');
    error.statusCode = 404;
    throw error;
  }
  return routine;
};

const bulkCreateRoutines = async (routines, userId) => {
  const entries = routines.map(r => ({ ...r, createdBy: userId }));
  return ClassRoutine.insertMany(entries);
};

const deleteRoutinesByClass = async (className, section) => {
  return ClassRoutine.deleteMany({ className, section });
};

module.exports = { getRoutines, getRoutineById, createRoutine, updateRoutine, deleteRoutine, bulkCreateRoutines, deleteRoutinesByClass };
