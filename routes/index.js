const { Router } = require("express");
const router = Router();
// const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')

router.use(cors());

// router.use(
//   '/airports',
//   createProxyMiddleware({
//     target: 'https://zsebrief-backend-production.up.railway.app',
//     changeOrigin: true,
//   })
// );

// // Proxy to your local server (e.g., running on port 3000)
// router.use('/local', createProxyMiddleware({
//   target: 'http://localhost:3001',
//   changeOrigin: true,
// }));


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