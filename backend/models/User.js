const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },  // bcrypt hashed
  profile:   { type: String, enum: ['student','freelancer','custom'], default: 'custom' },
  name:      { type: String, default: '' },
  budget:    { type: Number, default: 50000 },
  features:  [String],
  // All your app data lives here
  transactions:     { type: Array, default: [] },
  bills:            { type: Array, default: [] },
  invoices:         { type: Array, default: [] },
  exams:            { type: Array, default: [] },
  accounts:         { type: Array, default: [] },
  clients:          { type: Array, default: [] },
  emis:             { type: Array, default: [] },
  priorityPayments: { type: Array, default: [] },
  hasBills:         { type: Boolean, default: false },
  examMode:         { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);