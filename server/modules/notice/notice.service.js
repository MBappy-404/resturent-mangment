const Notice = require('./notice.model');

const getAll = async (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.targetAudience) filter.targetAudience = query.targetAudience;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [notices, total] = await Promise.all([
    Notice.find(filter).populate('createdBy', 'name').sort({ isPinned: -1, publishDate: -1 }).skip(skip).limit(limit),
    Notice.countDocuments(filter)
  ]);

  return { notices, total, page, pages: Math.ceil(total / limit) };
};

const getById = async (id) => {
  const notice = await Notice.findById(id).populate('createdBy', 'name');
  if (!notice) {
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }
  return notice;
};

const create = async (data, userId) => {
  return Notice.create({ ...data, createdBy: userId });
};

const update = async (id, data) => {
  const notice = await Notice.findByIdAndUpdate(id, data, { new: true });
  if (!notice) {
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }
  return notice;
};

const remove = async (id) => {
  const notice = await Notice.findByIdAndDelete(id);
  if (!notice) {
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }
  return notice;
};

module.exports = { getAll, getById, create, update, remove };
