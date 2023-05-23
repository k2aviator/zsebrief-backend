const mongoose = require('mongoose');

const Airports = require('../models/airports');

module.exports = {};

module.exports.create = async (name) => {
    const airports = await Airports.create({ name });
    return airports;
}

module.exports.getAll = async () => {
    const airports = await Airports.find().lean();
    return airports;
}

module.exports.getById = async (airportId) => {
    const airport = await Item.findOne({ _id: airportId }).lean();
    return airport;
}
