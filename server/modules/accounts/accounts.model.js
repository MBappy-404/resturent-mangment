const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({
  txnId: { type: String, unique: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'Cash' },
  reference: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

accountsSchema.pre('save', async function (next) {
  if (!this.txnId) {
    const count = await mongoose.model('Accounts').countDocuments();
    this.txnId = `TXN-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Accounts', accountsSchema);
