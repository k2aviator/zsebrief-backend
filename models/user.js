const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Local auth fields
  password: { type: String },
  email: { type: String, unique: true, sparse: true },

  // VATSIM auth fields
  cid: { type: Number, unique: true, sparse: true },
  fullName: { type: String },
  rating: { type: String },

  // Common
  roles: { type: [String], required: true },
  authProvider: { type: String, enum: ["local", "vatsim"], required: true }
});

module.exports = mongoose.model("users", userSchema);