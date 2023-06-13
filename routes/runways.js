const { Router } = require("express");
const router = Router();

const runwaysDAO = require('../daos/runways');

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
    const runwayList = await runwaysDAO.getListByCode(airportCode);
    if (runwayList) {
        res.json(runwayList);
    } else {
        res.sendStatus(404);
    }
})



module.exports = router;