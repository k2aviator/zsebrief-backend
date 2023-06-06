const { Router } = require("express");
const router = Router();
const isAdmin = require('../utils/isadmin.js');
//const adminDAO = require('../daos/admin.js');
const userDAO = require('../daos/user');
const adminDAO = require('../daos/admin');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'


router.get("/deps-by-class/:aptClass", async (req, res, next) => {
    try{
      const aptClass = req.params.aptClass;
      //console.log("apt class in route ", aptClass)
      const classAptDeps = await adminDAO.getDepsByAptClass(aptClass);
      res.json(classAptDeps)
      next()
    }catch(e) {
        next(e)
    }
})

module.exports = router;