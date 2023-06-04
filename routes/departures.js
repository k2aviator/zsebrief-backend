const { Router } = require("express");
const router = Router();
const isAdmin = require('../utils/isadmin.js');
const departuresDAO = require('../daos/departures');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'

router.post("/", isAdmin, async (req, res, next) => {
    try{
    const departureDetails = req.body;
    // console.log("airport details are ", airportDetails)
    // console.log("request user is ", req.user)
    const createdDeparture = await departuresDAO.create(departureDetails);
    //console.log("POST FUNCTION - created departure ", createdDeparture )
    res.json(createdDeparture);
    }catch(e) {
        next(e)
    }
});

router.get("/", async (req, res, next) => {
    //console.log("ROUTE - Departure get function")
    const departuresAll = await departuresDAO.getAll();
    //console.log("returned departures from get function ", departuresAll)
    if (departuresAll) {
        return res.json(departuresAll);
    } else {
        res.sendStatus(404);
    }
})

router.get("/:id", async (req, res, next) => {
    //console.log("get by departure ID")
    const depId = req.params.id;
    const departure = await departuresDAO.getById(depId);
    if (departure) {
        res.json(departure);
    } else {
        res.sendStatus(404);
    }
});

router.put("/:id", isAdmin, async (req, res, next) => {
    try {
        // console.log("departures PUT route")
        let token = req.headers.authorization
        token = token.replace('Bearer ', '')
        const verifyUserId = jwt.verify(token, secret)
        req.user = verifyUserId
        const departureId = req.params.id;
        const userEmail = req.user.email
        const departureDetails = req.body
        console.log("user email is  ", userEmail)
        const updatedDeparture = await departuresDAO.updateDeparture(departureDetails, userEmail, departureId)
        //console.log("updated airport returned is ", updatedDeparture)
        return res.json(updatedDeparture);
    } catch(e) {
        next(e)
    }
});



router.delete("/:id", isAdmin, async (req, res, next) => {
    try {
        //console.log("departures DELETE route")
        const depId = req.params.id;
        const success = await departuresDAO.deleteById(depId);
        res.sendStatus(success ? 200 : 400);
        return res.json();
    } catch(e) {
        res.status(500).send(e.message)
        next(e)
    }
});

module.exports = router;