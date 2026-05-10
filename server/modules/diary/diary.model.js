const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  diaryId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['homework', 'classwork', 'notice', 'remark'], required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  subject: { type: String, default: '' },
  content: { type: String, required: true },
  dueDate: { type: Date },
  createdBy: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

diarySchema.pre('save', async function (next) {
  if (!this.diaryId) {
    const count = await mongoose.model('Diary').countDocuments();
    this.diaryId = `DRY-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Diary', diarySchema);
