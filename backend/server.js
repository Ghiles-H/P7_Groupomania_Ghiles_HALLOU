//Import
var express = require("express");
var bodyParser = require("body-parser");
var apiRouter = require("./apiRouter").router;
var cors = require("cors");
const cookieParser = require('cookie-parser');
const {checkUser, requireAuth} = require("./middlewares/userAuth.middleware")
const path = require('path');
const { scrapGag } = require("./utils/puppeteer.utils");

//Instantiate server
const server = express();

//Body parser Config
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//Cookie parser Config
server.use(cookieParser());




server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

server.use(cors({credentials: true, origin: 'http://localhost:3000'}))
//Config routes
server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1>Hello World ! :)</h1>");
});

//Puppeteer
server.get('/puppeteer/:gagLink', scrapGag )

//jwt
server.get('*', checkUser);
server.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user)
});

server.use("/images", express.static(path.join(__dirname,'images')))
server.use("/api/", apiRouter);

//Launch server
const portServer = 8080;
server.listen(portServer, function () {
  console.log("Server en écoute sur le port ", portServer);
});
