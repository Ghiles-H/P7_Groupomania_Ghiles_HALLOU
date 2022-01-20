//Import
var express = require("express");
var bodyParser = require("body-parser");
var apiRouter = require("./apiRouter").router;

//Instantiate server
var server = express();

//Body parser Config
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
})

//Config routes
server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1>Hello World ! :)</h1>");
});

server.use("/api/", apiRouter);

//Launch server
server.listen(8080, function () {
  console.log("Server en écoute");
});
