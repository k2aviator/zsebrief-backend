const mongoose = require('mongoose');

const airportsSchema = new mongoose.Schema({
  ICAO: { type: String},
  AIRSPACE_CLASS: { type: String },
  ELEV: { type: Number },
  HRS_CLOSE:{ type: Number },
  HRS_OPEN:{ type: Number },
  TOWERED: {type: String},
  UPDATED: {type: String},
  AIRSPACE_CLASS: {type: String},
  LAT: {type: String },
  LONG: {type: String },
  NAME: { type: String },
  NOTES: { type: String }
});


module.exports = mongoose.model("airports", airportsSchema);