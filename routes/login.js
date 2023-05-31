const { Router } = require("express");
const router = Router()
const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'


router.use(async (req,res,next) => {
    try {
        let token = req.headers.authorization
        if (!token || !token.indexOf('Bearer ') === 0 ){ 
            //console.log('not authorized: req url', req.url, ' token? ', token, ' method', req.method)
            if (req.url === "/logout" && req.method === "POST"){
                res.status(404).send("Post before logout, send 404")
            } else if (req.method === "POST" && !req.body.password){
                res.status(400).send("No password")
            } else if (req.url === "/password" && req.method === "POST"){
                res.status(401).send("No password")
            } else {
                next()
            }          
        } else {
            //console.log('is authorized: req url', req.url, ' token? ', token, ' method', req.method)
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
})

router.post("/signup", async (req, res, next) => {
    try {
        //console.log("Sign up function")
        //console.log("sign up route request body ", req.body, "request user is ", req.user, " request params", req.params)
        if (req.body.email && req.body.password){
        const findUser = await userDAO.getUser(req.body.email)
        //console.log("find user is", findUser)
            if (!findUser === false){
                //console.log("user already exists, send 409")
                return res.status(409).send("user already exists - send 409")
            } else {  
                const hashedPass = await userDAO.hashPassword(req.body.password)
                const newUser = await userDAO.createUser(req.body.email, hashedPass)
                //console.log("new user is ", newUser)
                return res.json({newUser})
            }
        }    
    } catch(e) {
        next(e)
    }
});

router.post("/isadmin", async(req, res, next) => {
    try {
        //console.log("is admin checker function")
        let token = req.headers.authorization
        token = token.replace('Bearer ', '')
        //console.log("token in is admin function is ", token)
        const verifyUserId = jwt.verify(token, secret)
        const userId = verifyUserId._id
        // console.log("verified user id is ", verifyUserId, " user id is ", userId)
        const isAdmin = await userDAO.getRoleByUserId(userId)
        //console.log("is admin result ", isAdmin)
        return res.json({"admin":isAdmin})
    } catch(e) {  
        console.log(e)
        next(e)
    }

});

router.post("/", async (req, res, next) => {
    try {
    //console.log("post request body" , req.body)
    //console.log(req.headers)
    const userEmail = req.body.email
    const userPassword = req.body.password
    if (!userPassword){
        return res.status(400).send("") 
    }
    const findUser = await userDAO.getUser(req.body.email)
    //console.log("returned find user is ", findUser)
    if (!findUser == false){
        if(!req.body.password){
            return res.status(400).send("no password provided") 
        } else {
            const checkPass = await userDAO.checkPassword(req.body.email, req.body.password)
            if (checkPass == true){
                //console.log("find user is ", findUser)
                const userId = findUser._id
                const userEmail = findUser.email
                const userRoles = findUser.roles
                //console.log("request user is ", req.user)
                //console.log("user id is ", userId, " user email is ", userEmail, " and user role is ", userRoles)
                //let token = jwt.sign({email: userEmail,_id: userId, roles:['user']}, secret)
                let token = jwt.sign({email: userEmail,_id: userId, roles:userRoles}, secret)              
                req.headers.authorization = token
                //console.log("returned token is ", token)
                return res.json({token})
            } else {
                //console.log("401 error")
                return res.status(401).send("") 
            }
        }
   
    } else {
        //console.log("RETURN user doesn't exist")
        return res.status(401).send("user doesn't exist")
    }     
     
    } catch(e) {  
        // console.log(e)
        next(e)
    }
});


router.post("/password", async (req, res, next) => {
    try {
        //console.log('POST PASS FUNCTION')
        const bodyPassword = req.body.password
        const userId = req.user._id
        if (!bodyPassword){
            res.status(400).send("no password provided")
        } else {
            const hashedPass = await userDAO.hashPassword(bodyPassword)
            const updatedPassword = await userDAO.updateUserPassword(userId, hashedPass)
            if (updatedPassword === true){
                //console.log("POST PASS - password updated to  ", bodyPassword, " send status 200")
                return res.status(200).send("updated password")
            } 
            // else {
            //     //console.log("POST PASS - unable to update password ", updatedPassword)
            //     return res.status(401).send("")
            // }
        }
        next()
    } catch(e) {
        // console.log(e)
        next(e)
    }
});



module.exports = router;