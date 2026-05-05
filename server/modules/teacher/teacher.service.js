const Teacher = require('./teacher.model');

const getAllTeachers = async (query = {}) => {
  const filter = {};
  if (query.department) filter.department = query.department;
  if (query.designation) filter.designation = query.designation;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { nameBn: { $regex: query.search, $options: 'i' } },
      { teacherId: { $regex: query.search, $options: 'i' } }
    ];
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;
  const skip = (page - 1) * limit;

  const [teachers, total] = await Promise.all([
    Teacher.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Teacher.countDocuments(filter)
  ]);

  return { teachers, total, page, pages: Math.ceil(total / limit) };
};

const getTeacherById = async (id) => {
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = 404;
    throw error;
  }
  return teacher;
};

const createTeacher = async (data, userId) => {
  return Teacher.create({ ...data, createdBy: userId });
};

const updateTeacher = async (id, data) => {
  const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = 404;
    throw error;
  }
  return teacher;
};

const deleteTeacher = async (id) => {
  const teacher = await Teacher.findByIdAndDelete(id);
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = 404;
    throw error;
  }
  return teacher;
};

const getTeacherStats = async () => {
  const [total, active, byDepartment] = await Promise.all([
    Teacher.countDocuments(),
    Teacher.countDocuments({ status: 'active' }),
    Teacher.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$department', count: { $sum: 1 }, totalSalary: { $sum: '$salary' } } },
      { $sort: { _id: 1 } }
    ])
  ]);
  return { total, active, byDepartment };
};

module.exports = { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher, getTeacherStats };
