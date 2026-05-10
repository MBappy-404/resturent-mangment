const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  bookId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, default: '' },
  category: { type: String, required: true },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  location: { type: String, default: '' },
  status: { type: String, enum: ['available', 'low_stock', 'out_of_stock'], default: 'available' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

librarySchema.pre('save', async function (next) {
  if (!this.bookId) {
    const count = await mongoose.model('Library').countDocuments();
    this.bookId = `BK-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Library', librarySchema);
