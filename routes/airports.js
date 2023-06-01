const { Router } = require("express");
const router = Router();
const isAdmin = require('../utils/isadmin.js');
const airportsDAO = require('../daos/airports');
const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'





router.get("/", async (req, res, next) => {
    const airports = await airportsDAO.getAll();
    if (airports) {
        return res.json(airports);
    } else {
        res.sendStatus(404);
    }
})

router.post("/:ICAO", isAdmin, async (req, res, next) => {
    try{
    const airportDetails = req.body;
    // console.log("POST FUNCTION")z
    // console.log("airport details are ", airportDetails)
    // console.log("request user is ", req.user)
    const createdAirport = await airportsDAO.create(airportDetails);
    res.json(createdAirport);
    }catch(e) {
        next(e)
    }
});


//Need to add back isAdmin function
router.put("/:ICAO", isAdmin, async (req, res, next) => {
    try {
        // console.log("AIRPORT PUT ROUTE")
        let token = req.headers.authorization
        token = token.replace('Bearer ', '')
        const verifyUserId = jwt.verify(token, secret)
        req.user = verifyUserId
        const userEmail = req.user.email
        //console.log("user is ", userEmail)
        const airportDetails = req.body
        //console.log("request body is ", airportDetails)
        const updatedAirport = await airportsDAO.updateAirport(airportDetails, userEmail)
        // console.log("updated airport returned is ", updatedAirport)
        return res.json(updatedAirport);
    } catch(e) {
        next(e)
    }
});


router.get("/:ICAO", async (req, res, next) => {
    //console.log("get by ICAO code")
    const icaoCode = req.params.ICAO;
    const airport = await airportsDAO.getByCode(icaoCode);
    //console.log('returned airport is ', airport)
    if (airport) {
        res.json(airport);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;