const { Router } = require("express");
const router = Router();
const cors = require('cors')

router.use(cors());

router.use("/airports", require('./airports'));
router.use("/departures", require('./departures'));
router.use("/runways", require('./runways'));
router.use("/login", require('./login'));
router.use("/admin", require('./admin'))

router.get("/", (req, res, next) => {
  res.send(`
    <html>
      <body>
        <h1> ZSEBrief Backend </h1>
        <a href="/airports">GET Airports</a><br>
        <a href="/departures">GET Departures</a><br>
        <a href="/runways">GET Runways</a><br>
        <a href="/login">GET Users</a><br>
      </body>
    </html>
  `)
});

module.exports = router;