const mongoose = require('mongoose');
const Users = require('../models/user');
const bcrypt = require('bcrypt')


module.exports = {};

module.exports.createUser = async (username, hashedPass) => {
    const addedUser = await Users.create({email:username, password:hashedPass, roles:['user']})
    return true;
}

module.exports.getUser = async (userName) => {
    const userRecord = await Users.find({email:userName})
    if (userRecord.length == 0) {
        return false
    } else {
        return userRecord 
    }
}

module.exports.getUserById = async (userId) => {
    const userRecord = await Users.find({_id:userId})
    if (userRecord.length == 0) {
        return false
    } else {
        return userRecord[0]
    }
}

module.exports.checkPassword = async (userId, password) => {
    const userRecord = await Users.find({email:userId})
    const userRecordPassword = userRecord[0].password
    const toMatch = await bcrypt.compare(password,userRecordPassword)
    return toMatch
}

module.exports.hashPassword = async (password) => {
    let savedHash;
    function logHash(hash){
        savedHash = hash
    }

    const hashedResult = await bcrypt.hash(password, 10)
    return hashedResult
}


module.exports.updateUserPassword = async (userId, password) => {
    //console.log("DAO - update password ")
    //console.log('user id is ', userId)
    const allUsers = await Users.find();
    //console.log('all users to match from' , allUsers)
    const matchId = await Users.findOne({_id:userId})
    //console.log("match result is ", matchId)
    const updatePassword = await Users.updateOne({_id:userId},{password:password})
    //console.log("DAO update password result ", updatePassword)
    //console.log("all users after password update ", await User.find())
    if (!updatePassword){
        return false
    } else {
        return true
    }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
