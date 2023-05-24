const mongoose = require('mongoose');

const runwaysSchema = new mongoose.Schema({
    CALM_WIND_RUNWAY: { type: String},
    CALM_WIND_THRESHOLD:{ type: String},
    DVA:{ type: String},
    IAP:{ type: String},
    ICAO:{ type: String},
    LENGTH_FT:{ type: Number },
    MAG_HEADING: { type: Number },
    ODP:{ type: String},
    RUNWAY:{ type: String},
    TRAFFIC_PATTERN:{ type: String},
    TRUE_HEADING:{ type: Number },
    UPDATED: { type: String},
    WIDTH_FT:{ type: Number }
});


module.exports = mongoose.model("runways", runwaysSchema);