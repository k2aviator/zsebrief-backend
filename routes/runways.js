const { Router } = require("express");
const router = Router();

const isAdmin = require('../utils/isadmin.js');
const runwaysDAO = require('../daos/runways');
const jwt = require('jsonwebtoken')
const secret = 'Harraseeket'


router.post("/", isAdmin, async (req, res, next) => {
    try{
    const airportCode = req.params.ICAO;
    const runwayDetails = req.body;
    const createdRunway= await runwaysDAO.create(runwayDetails);
    // console.log("created runway is ", createdRunway)
    res.json(createdRunway);
    }catch(e) {
        next(e)
    }
});

router.get("/", async (req, res, next) => {
    const runways = await runwaysDAO.getAll();
    if (runways) {
        return res.json(runways);
    } else {
        res.sendStatus(404);
    }
})

router.get("/numbers/:ICAO", async (req, res, next) => {
    const airportCode = req.params.ICAO;
    // console.log("Route... airport ICAO passed through ", airportCode)
    const runwayList = await runwaysDAO.getListByCode(airportCode);
    if (runwayList) {
        res.json(runwayList);
    } else {
        res.sendStatus(404);
    }
})

router.put("/:id", isAdmin, async (req, res, next) => {
    try {
        let token = req.headers.authorization
        token = token.replace('Bearer ', '')
        const verifyUserId = jwt.verify(token, secret)
        req.user = verifyUserId
        const runwayId = req.params.id;
        const userEmail = req.user.email
        const runwayDetails = req.body
        const updatedRunway = await runwaysDAO.updateRunway(runwayDetails, userEmail, runwayId)
        return res.json(updatedRunway);
    } catch(e) {
        next(e)
    }
});


router.delete("/:id", isAdmin, async (req, res, next) => {
    try {
        const runwayId = req.params.id;
        const success = await runwaysDAO.deleteById(runwayId);
        res.sendStatus(success ? 200 : 400);
        return res.json();
    } catch(e) {
        res.status(500).send(e.message)
        next(e)
    }
});


module.exports = router;