//const mongoose = require('mongoose');

module.exports = {};

const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'

const isAuthorized = async (req,res,next) => {
    try {
        let token = req.headers.authorization
        if (!token || !token.indexOf('Bearer ') === 0 ){ 
            if (req.url === "/logout" && req.method === "POST"){
                res.status(404).send("Post before logout, send 404")
            } else if (req.method === "POST" && !req.body.password){
                res.status(400).send("No password")
            } else {
                next()
            }          
        } else {
            // console.log('is authorized: req url', req.url, ' token? ', token, ' method', req.method)
            token = token.replace('Bearer ', '')
            try {
                const verifyUserId = jwt.verify(token, secret)
                //console.log("verified user information for login function ", verifyUserId)
                req.user = verifyUserId
                next()
            } catch(e){
                res.status(401).send("invalid token")
                next(e)
            }
           
        }
    } catch (e) {
        next(e)
    }
}


module.exports = isAuthorized;