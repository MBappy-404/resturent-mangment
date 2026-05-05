const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  nameBn: { type: String, trim: true },
  fatherName: { type: String, trim: true },
  motherName: { type: String, trim: true },
  guardianPhone: { type: String, trim: true },
  guardianEmail: { type: String, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
  religion: { type: String, default: '' },
  nationality: { type: String, default: 'Bangladeshi' },
  className: { type: String, required: true },
  section: { type: String, required: true },
  roll: { type: Number },
  session: { type: String },
  admissionDate: { type: Date, default: Date.now },
  address: {
    present: { type: String, default: '' },
    permanent: { type: String, default: '' }
  },
  birthCertificateNo: { type: String, default: '' },
  previousSchool: { type: String, default: '' },
  photo: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'transferred', 'graduated'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

studentSchema.pre('save', async function (next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
