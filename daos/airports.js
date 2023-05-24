const mongoose = require('mongoose');

const Airports = require('../models/airports');

module.exports = {};

module.exports.create = async (name) => {
    const airports = await Airports.create({ name });
    return airports;
}

module.exports.getAll = async () => {
    //console.log("DAO function")
    const airports = await Airports.find().lean();
    return airports;
}

module.exports.getById = async (airportId) => {
    const airport = await Item.findOne({ _id: airportId }).lean();
    return airport;
}


//BELOW FOR MATCHING STRINGS

// module.exports.updateAirports = async () => {
//     //console.log("DAO  - update items")
//     const updatedAirports = await Airports.updateMany(
//         {  HRS_OPEN: { $regex: /NA/ } },
//         {  $set: { HRS_OPEN: '9999' } }
//     );
//     return updatedAirports;
// }

//ABOVE FOR MATCHING STRINGS

//BELOW FOR CHANGING DATA TYPES

module.exports.updateAirports = async () => {
    //console.log("DAO  - update items")
    const updatedAirports = await Airports.updateMany({},[
    {     
        $set: {
            HRS_OPEN: {
                $toInt: "$HRS_OPEN"
                }
        }
        
    }

    ]);
    return updatedAirports;
}

//ABOVE FOR CHANGING DATA TYPES