//Imports

var express = require("express");

var usersCtrl = require("./routes/usersCtrl");
var messageCtrl = require("./routes/messageCtrl");
var likesCtrl = require("./routes/likesCtrl");
var multer = require("./middlewares/multerConfig");
const commentsCtrl = require("./routes/commentsCtrl");
const uploadProfil = require("./middlewares/multerConfig");
const uploadPost = require("./middlewares/multerConfig_2");
//upload.single('profil_image'),
//Router
exports.router = (function () {
  var apiRouter = express.Router();

  
  //Users routes
  apiRouter.route("/users/register/").post(usersCtrl.register);
  apiRouter.route("/users/login/").post(usersCtrl.login);
  apiRouter.route("/users/updateprofilImg/:id").post( uploadProfil.single('image'), usersCtrl.updateImgProfil);
  

  apiRouter.route("/users/logout/").get(usersCtrl.logout);
  apiRouter.route("/users/getprofile/").get(usersCtrl.getUserProfile);
  apiRouter.route("/users/getprofile/:id").get(usersCtrl.getUserInfo);
  apiRouter.route("/users").get(usersCtrl.getAllUsers);

  apiRouter.route("/users/updateprofil/:id").put(usersCtrl.updateUserProfile);

  apiRouter.route("/users/deleteprofile/").delete(usersCtrl.deleteUser);

  //Messages routes
  apiRouter.route("/messages/create/").post(uploadPost.single('image'), messageCtrl.createMessage);

  apiRouter.route("/messages/").get(messageCtrl.listMessage);
  apiRouter.route("/messages/:messageId").get(messageCtrl.getOneMessage);

  apiRouter
    .route("/messages/delete/:messageId")
    .delete(messageCtrl.deleteMessage);

  //Likes routes
  apiRouter.route("/messages/vote/like/:messageId").post(likesCtrl.likePost);
  apiRouter
    .route("/messages/vote/unlike/:messageId")
    .post(likesCtrl.unlikePost);

  //Comments routes
  apiRouter.route("/comments/create/:messageId").post(commentsCtrl.createComment);

  apiRouter.route("/comments/").get(commentsCtrl.listComment);
  return apiRouter;
})();
