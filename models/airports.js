const mongoose = require('mongoose');

const airportsSchema = new mongoose.Schema({
  ICAO: { type: String, required: true, index:true },
  AIRSPACE_CLASS: { type: String },
  ELEV: { type: Number },
  HRS_CLOSE:{ type: Number },
  HRS_OPEN:{ type: Number },
  TOWERED: {type: Boolean},
  UPDATED: {type: Date},
  AIRSPACE_CLASS: {type: String},
  LAT: {type: Number },
  LONG: {type: Number },
  NAME: { type: String },
  NOTES: { type: String }
});


module.exports = mongoose.model("airports", airportsSchema);