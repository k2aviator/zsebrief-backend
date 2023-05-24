const mongoose = require('mongoose');

const Runways = require('../models/runways');

module.exports = {};

// module.exports.create = async (name) => {
//     const runways = await Runways.create({ name });
//     return runways;
// }

module.exports.getAll = async () => {
    //console.log("DAO function")
    const runways = await Runways.find().lean();
    return runways;
}

// module.exports.getById = async (airportId) => {
//     const airport = await Item.findOne({ _id: airportId }).lean();
//     return airport;
// }


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

// module.exports.updateAirports = async () => {
//     //console.log("DAO  - update items")
//     const updatedAirports = await Airports.updateMany({},[
//     {     
//         $set: {
//             HRS_OPEN: {
//                 $toInt: "$HRS_OPEN"
//                 }
//         }
        
//     }

//     ]);
//     return updatedAirports;
// }

//ABOVE FOR CHANGING DATA TYPES