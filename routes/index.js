const { Router } = require("express");
const router = Router();

router.use("/airports", require('./airports'));
// router.use("/runways", require('./runways'));
// router.use("/departures", require('./departures'));


router.get("/", (req, res, next) => {
  res.send(`
    <html>
      <body>
        <h1> Hello, world! </h1>
      </body>
    </html>
  `)
});

module.exports = router;