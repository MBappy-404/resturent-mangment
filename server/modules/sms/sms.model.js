const mongoose = require('mongoose');

const smsTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, default: '' },
  content: { type: String, required: true },
  type: { type: String, enum: ['attendance', 'fee', 'notice', 'result', 'custom'], default: 'custom' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const smsHistorySchema = new mongoose.Schema({
  template: { type: String, default: '' },
  recipients: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'pending', 'failed'], default: 'pending' },
  type: { type: String, enum: ['attendance', 'fee', 'notice', 'result', 'custom'], default: 'custom' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const SMSTemplate = mongoose.model('SMSTemplate', smsTemplateSchema);
const SMSHistory = mongoose.model('SMSHistory', smsHistorySchema);

module.exports = { SMSTemplate, SMSHistory };
