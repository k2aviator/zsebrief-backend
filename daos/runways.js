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

module.exports.getListByCode = async (airportCode) => {
    //const runways = await Runways.find().lean();
    const runways = await Runways.find({ ICAO: airportCode }, {RUNWAY:1}).lean();
    // console.log("DAO GET - found runways ", runways)
    return runways;
}


module.exports.create = async (runwayDetails) => {
    const runway = await Runways.create(runwayDetails);
    return runway;
  }



  
module.exports.updateRunway = async (runwayDetails, userEmail, runwayId) => {

    const airportICAO = runwayDetails.ICAO;
    const departureUpdated = new Date();
  
    const updateQuery = { _id: runwayId };
  
    runwayDetails.UPDATED_BY = userEmail;
    runwayDetails.UPDATED = departureUpdated;
 
    
    delete runwayDetails._id;
    
    const updatedRunway = await Runways.updateOne(updateQuery, runwayDetails);
    const results = updatedRunway.acknowledged;

    const retreiveUpdatedRunway = await Runways.findOne({ _id: runwayId }).lean();

    if (results === true || results === "true") {
      return retreiveUpdatedRunway;
    }
  };



  module.exports.deleteById = async (runwayId) => {
    await Runways.deleteOne({ _id: runwayId });
    return true;
  }
