const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  className: { type: String, required: true },
  feeType: {
    type: String,
    enum: ['tuition', 'admission', 'exam', 'library', 'transport', 'sports', 'lab', 'other'],
    required: true
  },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ['monthly', 'quarterly', 'half-yearly', 'yearly', 'one-time'], default: 'monthly' },
  session: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const feePaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure' },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  fine: { type: Number, default: 0 },
  month: { type: String },
  year: { type: Number },
  paymentDate: { type: Date },
  paymentMethod: { type: String, enum: ['cash', 'bkash', 'nagad', 'rocket', 'bank', 'other'], default: 'cash' },
  transactionId: { type: String, default: '' },
  receiptNo: { type: String, unique: true },
  status: { type: String, enum: ['paid', 'partial', 'unpaid', 'waived'], default: 'unpaid' },
  note: { type: String, default: '' },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

feePaymentSchema.pre('save', async function (next) {
  if (!this.receiptNo) {
    const count = await mongoose.model('FeePayment').countDocuments();
    this.receiptNo = `RCP-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

module.exports = { FeeStructure, FeePayment };
