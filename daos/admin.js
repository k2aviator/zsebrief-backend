const mongoose = require('mongoose');

const Airports = require('../models/airports');
const Departures = require('../models/departures');

module.exports = {};

module.exports.getDepsByAptClass = async (aptClass) => {
    //console.log("admin DAO function... passed through aptClass ", aptClass )
    const departuresByAptClass = await Airports.aggregate([
        { $match: { AIRSPACE_CLASS: aptClass }
        },
        { $lookup: {
            from: 'departures',
            localField: 'ICAO',
            foreignField: 'ICAO',
            as: 'departures'
            }
        },
        { $unwind: '$departures' },
        { $sort: { 'departures.ICAO': 1 } }
    ]).exec();
    return departuresByAptClass
  }

