//Imports
var express = require("express");
var usersCtrl = require("./routes/usersCtrl");

//Router
exports.router = (function () {
  var apiRouter = express.Router();

  //Users route
  apiRouter.route("/users/register/").post(usersCtrl.register);
  apiRouter.route("/users/login/").post(usersCtrl.login);
  apiRouter.route("/users/getprofile/").get(usersCtrl.getUserProfile);
  apiRouter.route("/users/updateprofile/").put(usersCtrl.updateUserProfile);

  return apiRouter;
})();
