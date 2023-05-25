//const mongoose = require('mongoose');

module.exports = {};

const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'

const isAuthorized = async (req,res,next) => {
    try {
        let token = req.headers.authorization
        //console.log("request headers of authorization ", req.headers, "request body is ", req.body )
        if (!token || !token.indexOf('Bearer ') === 0 ){ 
            //console.log("token not present - send 401")
            res.status(401).send("Token not present")
        } else {
            token = token.replace('Bearer ', '')
            //console.log("token is valid ", token)
            try {
                const verifyUserId = jwt.verify(token, secret)
                //console.log("verified user information is ", verifyUserId)
                req.user = verifyUserId
                //return(req.user)
                next()
            } catch(e){
                //console.log("invalid token - send 401")
                res.status(401).send("invalid token")
                next(e)
            }
           
        }
    } catch (e) {
        console.log(e)
        next(e)
    }

}


module.exports = isAuthorized;