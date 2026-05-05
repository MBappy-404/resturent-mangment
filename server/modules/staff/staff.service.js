const Staff = require('./staff.model');

const getAllStaff = async (query = {}) => {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.category) filter.category = query.category;
  if (query.department) filter.department = query.department;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { nameBn: { $regex: query.search, $options: 'i' } },
      { staffId: { $regex: query.search, $options: 'i' } }
    ];
  }

  return Staff.find(filter).sort('-createdAt');
};

const getStaffById = async (id) => {
  const staff = await Staff.findById(id);
  if (!staff) {
    const error = new Error('Staff not found');
    error.statusCode = 404;
    throw error;
  }
  return staff;
};

const createStaff = async (data, userId) => {
  return Staff.create({ ...data, createdBy: userId });
};

const updateStaff = async (id, data) => {
  const staff = await Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!staff) {
    const error = new Error('Staff not found');
    error.statusCode = 404;
    throw error;
  }
  return staff;
};

const deleteStaff = async (id) => {
  const staff = await Staff.findByIdAndDelete(id);
  if (!staff) {
    const error = new Error('Staff not found');
    error.statusCode = 404;
    throw error;
  }
  return staff;
};

const getStaffStats = async () => {
  const [total, active, onLeave, byCategory, totalSalary] = await Promise.all([
    Staff.countDocuments(),
    Staff.countDocuments({ status: 'active' }),
    Staff.countDocuments({ status: 'on-leave' }),
    Staff.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]),
    Staff.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$salary' } } }
    ])
  ]);
  return { total, active, onLeave, byCategory, totalSalary: totalSalary[0]?.total || 0 };
};

module.exports = { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff, getStaffStats };
