const { Router } = require("express");
const router = Router();

const departuresDAO = require('../daos/departures');



router.get("/", async (req, res, next) => {
    const departures = await departuresDAO.getAll();
    if (departures) {
        return res.json(departures);
    } else {
        res.sendStatus(404);
    }
})

module.exports = router;