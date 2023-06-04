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
    const airportUpdated = new Date();
  
    const updateQuery = { ICAO: airportICAO };
  
    airportDetails.UPDATED_BY = userEmail;
    airportDetails.UPDATED = airportUpdated;
 
    // console.log("updated details are  ", airportDetails);
    const updatedAirport = await Airports.updateOne(updateQuery, airportDetails);
    const results = updatedAirport.acknowledged;
  
    const retrieveUpdatedAirport = await Airports.findOne({ ICAO: airportICAO }).lean();
    //console.log("updated airport in dao is ", retrieveUpdatedAirport);
  
    if (results === true) {
      return retrieveUpdatedAirport;
    }
  };


module.exports.getByCode = async (icaoCode) => {
    //console.log("icao code is ", icaoCode)
    const airport = await Airports.findOne({ ICAO: icaoCode }).lean();
    //console.log("returned airport is", airport)
    return airport;
}


module.exports.deleteByCode = async (icaoCode) => {
  await Airports.deleteOne({ ICAO: icaoCode });
  return true;
}
