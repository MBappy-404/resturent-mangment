const Subject = require('./subject.model');

const getAll = async (query = {}) => {
  const filter = {};
  if (query.className) filter.className = query.className;
  if (query.type) filter.type = query.type;
  return Subject.find(filter).populate('teacher', 'name').sort('className name');
};

const getById = async (id) => {
  const subject = await Subject.findById(id).populate('teacher', 'name');
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};

const create = async (data, userId) => {
  return Subject.create({ ...data, createdBy: userId });
};

const update = async (id, data) => {
  const subject = await Subject.findByIdAndUpdate(id, data, { new: true });
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};

const remove = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};

module.exports = { getAll, getById, create, update, remove };
