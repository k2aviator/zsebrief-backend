const mongoose = require('mongoose');

const departuresSchema = new mongoose.Schema({
  ICAO: { type: String, index:true, required: true},  
  CLIMB: { type: String },
  EXPECT_CRUISE: { type: String },
  UPDATED:{ type: String },
  NAME: {type: String},
  NEED_FOR_INTERIM_ALT: {type: String},
  NUM:  { type: Number },
  PROCEDURE: {type: String },
  RWY_SPECIFIC: {type: String },
  TOP_ALT: {type: String },
  TOP_ALT_LISTED:  {type: String },
  TOP_ALT_STATE:  {type: String },
  TYPE: { type: String },
  UPDATED_BY: { type: String }
});


module.exports = mongoose.model("departures", departuresSchema);