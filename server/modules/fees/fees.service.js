const { FeeStructure, FeePayment } = require('./fees.model');

const getFeeStructures = async (query = {}) => {
  const filter = {};
  if (query.className) filter.className = query.className;
  if (query.feeType) filter.feeType = query.feeType;
  if (query.session) filter.session = query.session;
  return FeeStructure.find(filter).sort('className feeType');
};

const createFeeStructure = async (data, userId) => {
  return FeeStructure.create({ ...data, createdBy: userId });
};

const updateFeeStructure = async (id, data) => {
  const structure = await FeeStructure.findByIdAndUpdate(id, data, { new: true });
  if (!structure) {
    const error = new Error('Fee structure not found');
    error.statusCode = 404;
    throw error;
  }
  return structure;
};

const deleteFeeStructure = async (id) => {
  const structure = await FeeStructure.findByIdAndDelete(id);
  if (!structure) {
    const error = new Error('Fee structure not found');
    error.statusCode = 404;
    throw error;
  }
  return structure;
};

const getPayments = async (query = {}) => {
  const filter = {};
  if (query.student) filter.student = query.student;
  if (query.status) filter.status = query.status;
  if (query.month) filter.month = query.month;
  if (query.year) filter.year = parseInt(query.year);
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    FeePayment.find(filter).populate('student', 'name studentId className section').sort('-createdAt').skip(skip).limit(limit),
    FeePayment.countDocuments(filter)
  ]);

  return { payments, total, page, pages: Math.ceil(total / limit) };
};

const collectFee = async (data, userId) => {
  const payment = await FeePayment.create({ ...data, collectedBy: userId });
  return payment.populate('student', 'name studentId className section');
};

const updatePayment = async (id, data) => {
  const payment = await FeePayment.findByIdAndUpdate(id, data, { new: true })
    .populate('student', 'name studentId className section');
  if (!payment) {
    const error = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }
  return payment;
};

const getStats = async (query = {}) => {
  const matchFilter = {};
  if (query.year) matchFilter.year = parseInt(query.year);
  if (query.month) matchFilter.month = query.month;

  const [totalCollected, totalDue, byMethod] = await Promise.all([
    FeePayment.aggregate([
      { $match: { ...matchFilter, status: { $in: ['paid', 'partial'] } } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]),
    FeePayment.aggregate([
      { $match: { ...matchFilter, status: { $in: ['unpaid', 'partial'] } } },
      { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } }
    ]),
    FeePayment.aggregate([
      { $match: { ...matchFilter, status: 'paid' } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$paidAmount' }, count: { $sum: 1 } } }
    ])
  ]);

  return {
    totalCollected: totalCollected[0]?.total || 0,
    totalDue: totalDue[0]?.total || 0,
    byMethod
  };
};

module.exports = { getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure, getPayments, collectFee, updatePayment, getStats };
