const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'

const isAdmin = async (req,res,next) => {
    try {
        //console.log("is admin function")
        let token = req.headers.authorization
        //console.log("request token is ", token )
        if (!token || !token.indexOf('Bearer ') === 0 ){ 
            //console.log("ADMIN function: token not present - send 401")
            res.status(401).send("Token not present")
        } else {
            
            token = token.replace('Bearer ', '')
            //console.log("token is valid ", token)
            try {
                const verifyUserId = jwt.verify(token, secret)
                const userRoles = verifyUserId.roles
                const isAdmin = userRoles.includes('admin')
                if (isAdmin){
                    //console.log('ADMIN function: is admin - next: req url', req.url, ' method', req.method)
                    //console.log("user roles is ", userRoles)
                    //console.log('user is admin ', isAdmin)
                    next()
                } else {
                    //console.log('ADMIN function: not an admin - send 403 : req url', req.url, ' method', req.method)
                    //console.log("user roles is ", userRoles)
                    //console.log('user is admin ', isAdmin)
                    res.status(403).send()
                }
            } catch(e){
                //console.log("invalid token - send 401")
                res.status(401).send("invalid token")
                next(e)
            }
           
        }
    } catch (e) {
        //console.log(e)
        next(e)
    }

}
module.exports = isAdmin;