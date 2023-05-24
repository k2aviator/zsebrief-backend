const { Router } = require("express");
const router = Router();

const airportsDAO = require('../daos/airports');

router.post("/", async (req, res, next) => {
    const { name } = req.body;
    const airport = await airportsDAO.create(name);
    res.json(airport);
});


router.get("/", async (req, res, next) => {
    console.log("Route function")
    const airports = await airportsDAO.getAll();
    console.log("airports is ", airports)
    if (airports) {
        return res.json(airports);
    } else {
        res.sendStatus(404);
    }
})

router.get("/:id", async (req, res, next) => {
    const airportId = req.params.id;
    const airport = await airportsDAO.getById(airportId);
    if (airport) {
        res.json(airport);
    } else {
        res.sendStatus(404);
    }
});

router.put("/", async (req, res, next) => {
    const airport = await airportsDAO.updateAirports();
    if (airport) {
        res.json(airport);
    } else {
        res.sendStatus(404);
    }
});


module.exports = router;