const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRouter = require("./modules/routes/index");
const gate = require("./modules/middlewares/permissions/gate");
const cors = require("cors");
global.config = require("./modules/config");

mongoose.connect();
mongoose.Promise = global.Promise;

//configure limit express
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// configuration Body Parser
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use("/public", express.static("public"));

//role & permissions config
app.use(gate.middleware());

/*
 configuration of Routing Project
*/
app.use(cors({ origin: true, credentials: true }));

app.use("/", apiRouter);

/*
 server Listening Port Configuration
*/
app.listen(config.port, () => {
  console.log(`server running at Port ${config.port}`);
});
