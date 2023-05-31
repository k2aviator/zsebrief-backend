const mongoose = require('mongoose');

const Airports = require('../models/airports');

module.exports = {};

module.exports.create = async (details) => {
    const airports = await Airports.create(details);
    //console.log("airport created in dao function ", airports)
    return airports;
}

module.exports.getAll = async () => {
    //console.log("DAO function")
    const airports = await Airports.find().lean();
    return airports;
}


module.exports.updateAirport = async (airportDetails, userEmail) => {
    const airportICAO = airportDetails.ICAO;
    const airportElev = airportDetails.ELEV;
    const airportHrsClose = airportDetails.HRS_CLOSE;
    const airportHrsOpen = airportDetails.HRS_OPEN;
    const airportLat = airportDetails.LAT;
    const airportLong = airportDetails.LONG;
    const airportName = airportDetails.NAME;
    const airportNotes = airportDetails.NOTES;
    const airportTowered = airportDetails.TOWERED;
    const airportUpdated = new Date();
    
    const updateQuery = {
      ICAO: airportICAO
    };
    
    const updateData = {
      ELEV: airportElev,
      HRS_CLOSE: airportHrsClose,
      HRS_OPEN: airportHrsOpen,
      LAT: airportLat,
      LONG: airportLong,
      NAME: airportName,
      NOTES: airportNotes,
      TOWERED: airportTowered,
      UPDATED_BY: userEmail,
      UPDATED_AT: airportUpdated
    };

    const updatedAirport = await Airports.updateOne(updateQuery, updateData);
    const results = updatedAirport.acknowledged
    const retrieveUpdatedAirport = await Airports.findOne({ICAO:airportICAO}).lean();
    //console.log("updated airport in dao is ", retrieveUpdatedAirport)
    if (results === true){
        return retrieveUpdatedAirport;
    }
    
}

// module.exports.updateAirport = async (airportDetails, userEmail) => {
//     //console.log("DAO  - update items")
//     console.log("airport details in DAO ", airportDetails)
//     //NEED TO FIGURE OUT BEST WAY TO BULK UPDATE
//     const airportICAO = airportDetails.ICAO
//     const airportElev = airportDetails.ELEV
//     const airportHrsClose = airportDetails.HRS_CLOSE
//     const airportHrsOpen = airportDetails.HRS_OPEN
//     const airportLat = airportDetails.LAT
//     const airportLong = airportDetails.LONG
//     const airportName = airportDetails.NAME
//     const airportNotes = airportDetails.NOTES
//     const airportTowered = airportDetails.TOWERED
//     const airportUpdated = new Date();
//     console.log("airport updated" , airportUpdated)
//     //console.log("airspace class ", airspaceClass)
//     const updatedAirport = await Airports.updateOne({ICAO:airportICAO},{ELEV:airportElev}, {UPDATED_BY:userEmail}).lean();
//     const results = updatedAirport.acknowledged
//     const retrieveUpdatedAirport = await Airports.findOne({ICAO:airportICAO}).lean();
//     //console.log("updated airport in dao is ", retrieveUpdatedAirport)
//     if (results === true){
//         return retrieveUpdatedAirport;
//     }
    
// }

module.exports.getByCode = async (icaoCode) => {
    //console.log("icao code is ", icaoCode)
    const airport = await Airports.findOne({ ICAO: icaoCode }).lean();
    //console.log("returned airport is", airport)
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