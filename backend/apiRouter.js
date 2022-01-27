//Imports
var express = require("express");
var usersCtrl = require("./routes/usersCtrl");
var messageCtrl = require("./routes/messageCtrl");
var likesCtrl = require('./routes/likesCtrl')

//Router
exports.router = (function () {
  var apiRouter = express.Router();

  //Users routes
  apiRouter.route("/users/register/").post(usersCtrl.register);
  apiRouter.route("/users/login/").post(usersCtrl.login);
  apiRouter.route("/users/getprofile/").get(usersCtrl.getUserProfile);
  apiRouter.route("/users/updateprofile/").put(usersCtrl.updateUserProfile);
  apiRouter.route("/users/deleteprofile/").delete(usersCtrl.deleteUser);

  //Messages routes
  apiRouter.route("/messages/create/").post(messageCtrl.createMessage);
  apiRouter.route("/messages/").get(messageCtrl.listMessage);
  apiRouter.route("/messages/:messageId").get(messageCtrl.getOneMessage);
  apiRouter.route("/messages/delete/:messageId").delete(messageCtrl.deleteMessage);
  //apiRouter.route("message/answer").post(messageCtrl.answerMessage);

  //Likes routes
  apiRouter.route("/messages/vote/like/:messageId").post(likesCtrl.likePost);
  apiRouter.route("/messages/vote/unlike/:messageId").post(likesCtrl.unlikePost);


  return apiRouter;
})();
