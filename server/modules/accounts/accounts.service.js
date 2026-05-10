const Accounts = require('./accounts.model');

const getAll = async (query = {}) => {
  const filter = {};
  if (query.search) {
    filter.$or = [
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  return Accounts.find(filter).sort('-createdAt');
};

const getById = async (id) => {
  const item = await Accounts.findById(id);
  if (!item) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
  return item;
};

const create = async (data, userId) => {
  return Accounts.create({ ...data, createdBy: userId });
};

const update = async (id, data) => {
  const item = await Accounts.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!item) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
  return item;
};

const remove = async (id) => {
  const item = await Accounts.findByIdAndDelete(id);
  if (!item) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
  return item;
};

module.exports = { getAll, getById, create, update, remove };
