const User = require('./auth.model');
const generateToken = require('../../utils/generateToken');

const registerUser = async ({ name, email, password, phone, schoolName }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    throw error;
  }
  const user = await User.create({ name, email, password, phone, role: 'admin' });
  const token = generateToken(user._id);
  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  if (!user.isActive) {
    const error = new Error('Account is deactivated');
    error.statusCode = 401;
    throw error;
  }
  user.lastLogin = new Date();
  await user.save();
  const token = generateToken(user._id);
  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar },
    token
  };
};

const getProfile = async (userId) => {
  return User.findById(userId);
};

const updateProfile = async (userId, data) => {
  const { name, phone, avatar } = data;
  return User.findByIdAndUpdate(userId, { name, phone, avatar }, { new: true });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }
  user.password = newPassword;
  await user.save();
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, changePassword };
