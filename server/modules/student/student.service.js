const Student = require('./student.model');

const getAllStudents = async (query = {}) => {
  const filter = {};
  if (query.className) filter.className = query.className;
  if (query.section) filter.section = query.section;
  if (query.session) filter.session = query.session;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { nameBn: { $regex: query.search, $options: 'i' } },
      { studentId: { $regex: query.search, $options: 'i' } }
    ];
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;
  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    Student.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Student.countDocuments(filter)
  ]);

  return { students, total, page, pages: Math.ceil(total / limit) };
};

const getStudentById = async (id) => {
  const student = await Student.findById(id);
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  return student;
};

const createStudent = async (data, userId) => {
  return Student.create({ ...data, createdBy: userId });
};

const updateStudent = async (id, data) => {
  const student = await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  return student;
};

const deleteStudent = async (id) => {
  const student = await Student.findByIdAndDelete(id);
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  return student;
};

const getStudentStats = async () => {
  const [total, active, byClass] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: 'active' }),
    Student.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$className', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);
  return { total, active, inactive: total - active, byClass };
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, getStudentStats };
