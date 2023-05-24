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


module.exports = router;