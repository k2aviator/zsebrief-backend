const express = require("express");

const routes = require("./routes");
const cors = require('cors')

const server = express();
server.use(express.json());

server.use(routes);
server.use(cors())

module.exports = server;


