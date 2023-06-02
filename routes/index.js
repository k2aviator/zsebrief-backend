const { Router } = require("express");
const router = Router();
// const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')

router.use(cors());

// router.use(
//   '/airports',
//   createProxyMiddleware({
//     target: 'http://localhost:3001',
//     changeOrigin: true,
//   })
// );


// router.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

router.use("/airports", require('./airports'));
router.use("/departures", require('./departures'));
router.use("/runways", require('./runways'));
router.use("/login", require('./login'));



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