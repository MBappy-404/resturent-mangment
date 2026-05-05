const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  nameBn: { type: String, trim: true },
  role: {
    type: String,
    enum: [
      'Head Teacher', 'Assistant Head Teacher', 'Senior Teacher', 'Assistant Teacher',
      'Junior Teacher', 'Librarian', 'Lab Assistant', 'Office Assistant',
      'Accountant', 'Peon', 'Guard', 'Cleaner', 'Driver', 'Computer Operator'
    ],
    required: true
  },
  roleBn: { type: String, default: '' },
  category: { type: String, enum: ['Teaching', 'Administrative', 'Support'], required: true },
  department: { type: String, required: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  dateOfBirth: { type: Date },
  nid: { type: String, default: '' },
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number, default: 0 },
  qualifications: { type: String, default: '' },
  responsibilities: [{ type: String }],
  address: { type: String, default: '' },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' }
  },
  bankInfo: {
    bankName: { type: String, default: '' },
    accountNo: { type: String, default: '' },
    mobileBanking: { type: String, default: '' }
  },
  photo: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

staffSchema.pre('save', async function (next) {
  if (!this.staffId) {
    const count = await mongoose.model('Staff').countDocuments();
    this.staffId = `STF-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Staff', staffSchema);
