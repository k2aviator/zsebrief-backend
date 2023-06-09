const mongoose = require('mongoose');

const airportsSchema = new mongoose.Schema({
  ICAO: { type: String, index:true, required: true},
  AIRSPACE_CLASS: { type: String, required: true },
  ELEV: { type: Number },
  HRS_CLOSE:{ type: Number },
  HRS_OPEN:{ type: Number },
  TOWERED: {type: String},
  UPDATED: {type: Date},
  LAT: {type: String },
  LONG: {type: String },
  NAME: { type: String },
  NOTES: { type: String }, 
  UPDATED_BY: { type: String }
});


module.exports = mongoose.model("airports", airportsSchema);