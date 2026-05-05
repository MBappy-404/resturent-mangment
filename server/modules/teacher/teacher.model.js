const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  nameBn: { type: String, trim: true },
  designation: {
    type: String,
    enum: ['Head Teacher', 'Assistant Head Teacher', 'Senior Teacher', 'Assistant Teacher', 'Junior Teacher'],
    default: 'Assistant Teacher'
  },
  designationBn: { type: String, default: '' },
  department: { type: String, required: true },
  subjects: [{ type: String }],
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  dateOfBirth: { type: Date },
  nid: { type: String, default: '' },
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number, default: 0 },
  qualifications: { type: String, default: '' },
  specialization: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  address: { type: String, default: '' },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
  photo: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'on-leave', 'retired'], default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

teacherSchema.pre('save', async function (next) {
  if (!this.teacherId) {
    const count = await mongoose.model('Teacher').countDocuments();
    this.teacherId = `TCH-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
