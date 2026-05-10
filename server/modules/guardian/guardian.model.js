const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema({
  guardianId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  occupation: { type: String, default: '' },
  relation: { type: String, default: 'Father' },
  students: [{
    id: String,
    name: String,
    class: String
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

guardianSchema.pre('save', async function (next) {
  if (!this.guardianId) {
    const count = await mongoose.model('Guardian').countDocuments();
    this.guardianId = `GRD-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Guardian', guardianSchema);
