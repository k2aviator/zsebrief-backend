const { Router } = require("express");
const router = Router()

const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'


const isAuthorized = async (req,res,next) => {
    try {
        let token = req.headers.authorization
        if (!token || !token.indexOf('Bearer ') === 0 ){ 
            res.status(401).send("Token not present")
        } else {
            token = token.replace('Bearer ', '')
            //console.log("token is valid ", token)
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


router.use(async (req, res, next) => {
    // send 404 if someone tries to access the logout page
    if (req.url === "/logout") {
        res.status(404).send()
    }
    next()
 });
 
 

router.post("/signup", async (req, res, next) => {
    try {
        //console.log("sign up route request body ", req.body, " request headers ", req.headers, " request user is ", req.user, " request params", req.params)
        if (req.body.email && req.body.password){
        const findUser = await userDAO.getUser(req.body.email)
            if (findUser.length > 0){
                return res.status(409).send("user already exists - send 409")
            } else {  
                const hashedPass = await userDAO.hashPassword(req.body.password)
                const newUser = await userDAO.createUser(req.body.email, hashedPass)
                return res.status(200).send("user created")
            }
        } else {
            res.status(400).send("")
        }
    
    } catch(e) {
        console.log(e)
        next(e)
    }
});



// router.post("/", async (req, res, next) => {
//     try {
//     //console.log("post request body" , req.body)
//     const userEmail = req.body.email
//     const userPassword = req.body.password
//     if (!userPassword){
//         return res.status(400).send("") 
//     }
//     const findUser = await userDAO.getUser(req.body.email)
//     //console.log("returned find user is ", findUser)
//     if (!findUser == false){
//         if(!req.body.password){
//             return res.status(400).send("no password provided") 
//         } else {
//             const checkPass = await userDAO.checkPassword(req.body.email, req.body.password)
//             if (checkPass == true){
//                 //console.log("find user is ", findUser[0])
//                 const userId = findUser[0]._id
//                 const userEmail = findUser[0].email
//                 const userRoles = findUser[0].roles
//                 //console.log("request user is ", req.user)
//                 //console.log("user id is ", userId, " user email is ", userEmail, " and user role is ", userRoles)
//                 //let token = jwt.sign({email: userEmail,_id: userId, roles:['user']}, secret)
//                 let token = jwt.sign({email: userEmail,_id: userId, roles:userRoles}, secret)              
//                 req.headers.authorization = token
//                 //console.log("returned token is ", token)
//                 res.json({token})
//             } else {
//                 return res.status(401).send("") 
//             }
//         }
   
//     } else {
//         //console.log("RETURN user doesn't exist")
//         return res.status(401).send("user doesn't exist")
//     }     
     
//     } catch(e) {  
//         console.log(e)
//         next(e)
//     }
// });

// router.use(async (req,res, next) => {
//     try {
//         let token = req.headers.authorization
//         if (!token || !token.indexOf('Bearer ') === 0 ){ 
//             res.status(401).send("Token not present")
//         } else {
//             token = token.replace('Bearer ', '')
//             //console.log("token is valid ", token)
//             try {
//                 const verifyUserId = jwt.verify(token, secret)
//                 //console.log("verified user information is ", verifyUserId)
//                 next()
//             } catch(e){
//                 res.status(401).send("invalid token")
//                 next(e)
//             }
           
//         }
//     } catch (e) {
//         next(e)
//     }

// });


// router.post("/password", isAuthorized, async (req, res, next) => {
//     try {
//         //console.log('POST PASS FUNCTION')
//         const bodyPassword = req.body.password
//         const userId = req.user._id
//         if (!bodyPassword){
//             res.status(400).send("no password provided")
//         } else {
//             const hashedPass = await userDAO.hashPassword(bodyPassword)
//             const updatedPassword = await userDAO.updateUserPassword(userId, hashedPass)
//             if (updatedPassword === true){
//                 //console.log("POST PASS - password updated to  ", bodyPassword, " send status 200")
//                 return res.status(200).send("updated password")
//             } else {
//                 //console.log("POST PASS - unable to update password ", updatedPassword)
//                 return res.status(401).send("")
//             }
//         }
//         next()
//     } catch(e) {
//         console.log(e)
//         next(e)
//     }
// });



module.exports = router;