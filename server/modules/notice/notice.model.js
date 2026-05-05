const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleBn: { type: String, default: '' },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['general', 'academic', 'exam', 'event', 'holiday', 'admission', 'result', 'urgent'],
    default: 'general'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'staff', 'parents'],
    default: 'all'
  },
  className: { type: String },
  attachments: [{ name: String, url: String }],
  publishDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  isPinned: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
