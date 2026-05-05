const Administration = require('./administration.model');

const getAll = async (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { nameBn: { $regex: query.search, $options: 'i' } },
      { designation: { $regex: query.search, $options: 'i' } }
    ];
  }

  return Administration.find(filter).sort({ category: 1, designation: 1 });
};

const getById = async (id) => {
  const member = await Administration.findById(id);
  if (!member) {
    const error = new Error('Administration member not found');
    error.statusCode = 404;
    throw error;
  }
  return member;
};

const create = async (data, userId) => {
  return Administration.create({ ...data, createdBy: userId });
};

const update = async (id, data) => {
  const member = await Administration.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!member) {
    const error = new Error('Administration member not found');
    error.statusCode = 404;
    throw error;
  }
  return member;
};

const remove = async (id) => {
  const member = await Administration.findByIdAndDelete(id);
  if (!member) {
    const error = new Error('Administration member not found');
    error.statusCode = 404;
    throw error;
  }
  return member;
};

const getStats = async () => {
  const [directors, governingBody, committee, active] = await Promise.all([
    Administration.countDocuments({ category: 'director' }),
    Administration.countDocuments({ category: 'governing-body' }),
    Administration.countDocuments({ category: 'committee' }),
    Administration.countDocuments({ status: 'active' })
  ]);
  return { directors, governingBody, committee, active, total: directors + governingBody + committee };
};

module.exports = { getAll, getById, create, update, remove, getStats };
