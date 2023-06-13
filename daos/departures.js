const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const Departures = require('../models/departures');

module.exports = {};

module.exports.create = async (details) => {
  // console.log("Departure to create ", details)
  const departure = await Departures.create(details);
  return departure;
}
module.exports.getAll = async () => {
    // console.log("DAO function")
    const departuresAll = await Departures.find().lean();
    // console.log("departures find from DAO function ", departuresAll)
    return departuresAll;
}

module.exports.getById = async (depId) => {
    console.log("Departures get by ID in DAO... dep id to search for ", depId)
    const dep = await Departures.findOne({ _id: depId }).lean();
    console.log("returned departure in DAO function ", dep)
    return dep;
}

module.exports.updateDeparture = async (departureDetails, userEmail, departureId) => {

    // console.log("DAO departure details are ", departureDetails)
    const airportICAO = departureDetails.ICAO;
    const departureUpdated = new Date();
  
    const updateQuery = { _id: departureId };
  
    departureDetails.UPDATED_BY = userEmail;
    departureDetails.UPDATED = departureUpdated;
 
    
    delete departureDetails._id;

    //console.log("DAO departure details after deleting id ", departureDetails)
    
    const updatedDeparture = await Departures.updateOne(updateQuery, departureDetails);
    const results = updatedDeparture.acknowledged;
  
    // console.log("updated departure is ", updatedDeparture)
    // console.log("departure id is ", departureId)

    const retrieveUpdatedDeparture = await Departures.findOne({ _id: departureId }).lean();

    // console.log("updated departure in dao is ", retrieveUpdatedDeparture);
    // console.log("results are ", results)
  
    if (results === true || results === "true") {
      return retrieveUpdatedDeparture;
    }
  };


  module.exports.deleteById = async (depId) => {
    await Departures.deleteOne({ _id: depId });
    return true;
  }
  

