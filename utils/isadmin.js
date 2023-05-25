
module.exports = {};
const userDAO = require('../daos/user');

const isAdmin = async (req,res,next) => {
    try {
        //console.log("IS ADMIN FUNCTION")
        // 1) Get user info
        //console.log("request user is ", req.user)
        //console.log("request body is ", req.body)  
        const findUser = await userDAO.getUser(req.user.email)
        //console.log("returned user is ", findUser)
        const userRoles = findUser[0].roles
        const isUser = userRoles.includes('user')
        const isAdmin = userRoles.includes('admin')
        //console.log('user roles are ', userRoles)
        //console.log("is admin? ", isAdmin)
        //console.log("is user? ", isUser )
        if (isAdmin === true){
            //console.log("is admin, next")
            next()
        } else {
            //console.log("is not admin")
            res.status(403).send()
            
        }
    } catch (e) {
        //console.log(e)
        next(e)
    }

}
module.exports = isAdmin;