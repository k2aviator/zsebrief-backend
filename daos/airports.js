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

// const airportLat = airportDetails.LAT;
// const airportLong = airportDetails.LONG;
// LAT: airportLat,
// LONG: airportLong,

module.exports.updateAirport = async (airportDetails, userEmail) => {
    const airportICAO = airportDetails.find((item) => item.ICAO).ICAO;
    const airportUpdated = new Date();
  
    const updateQuery = { ICAO: airportICAO };
  
    const updateData = airportDetails.reduce((acc, item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      acc[key] = value;
      return acc;
    }, {});
  
    updateData.UPDATED_BY = userEmail;
    updateData.UPDATED = airportUpdated;
  
    // console.log("airport details are ", airportDetails);
    console.log("update data is ", updateData);
  
    const updatedAirport = await Airports.updateOne(updateQuery, updateData);
    const results = updatedAirport.acknowledged;
  
    const retrieveUpdatedAirport = await Airports.findOne({ ICAO: airportICAO }).lean();
    console.log("updated airport in dao is ", retrieveUpdatedAirport);
  
    if (results === true) {
      return retrieveUpdatedAirport;
    }
  };

// module.exports.updateAirport = async (airportDetails, userEmail) => {
//     const airportICAO = airportDetails.ICAO;
//     const airportElev = airportDetails.ELEV;
//     const airportHrsClose = airportDetails.HRS_CLOSE;
//     const airportHrsOpen = airportDetails.HRS_OPEN;
//     const airportName = airportDetails.NAME;
//     const airportNotes = airportDetails.NOTES;
//     const airportTowered = airportDetails.TOWERED;
//     const airportUpdated = new Date();
    
//     const updateQuery = {
//       ICAO: airportICAO
//     };
    
//     const updateData = {
//       ELEV: airportElev,
//       HRS_CLOSE: airportHrsClose,
//       HRS_OPEN: airportHrsOpen,
//       NAME: airportName,
//       NOTES: airportNotes,
//       TOWERED: airportTowered,
//       UPDATED_BY: userEmail,
//       UPDATED_AT: airportUpdated
//     };
//     console.log("airport details are ", airportDetails)
//     console.log("update data is ", updateData)
//     const updatedAirport = await Airports.updateOne(updateQuery, updateData);
//     const results = updatedAirport.acknowledged
//     const retrieveUpdatedAirport = await Airports.findOne({ICAO:airportICAO}).lean();
//     console.log("updated airport in dao is ", retrieveUpdatedAirport)
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