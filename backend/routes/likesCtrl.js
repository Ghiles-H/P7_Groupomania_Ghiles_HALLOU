//Imports
var models = require("../models");
var jwtUtils = require("../utils/jwt.utils");
var asyncLib = require("async");

//Constants
let userLikedNow;

//Routes
module.exports = {
  likePost: function (req, res) {
    //Getting auth header
    var cookieAuth = req.cookies.cookieToken;
    var CookieUserId = jwtUtils.getUserId(cookieAuth);
    var BodyUserId = req.body.id;
    var userId = BodyUserId;
    
   

    //Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
        console.log("Waterfall function number = 1");
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (messageFound, done) {
        console.log("Waterfall function number = 2");
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        } else {
          res.status(404).json({ error: "post already liked" });
        }
      },
      function (messageFound, userFound, done) {
        console.log("Waterfall function number = 3");
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userFound.id,
              messageId: messageFound.id,
            },
          })
            .then(function (isUserAlreadyLiked) {
              done(null, messageFound, userFound, isUserAlreadyLiked);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify is user already liked" });
            });
        } else {
          res.status(404).json({ error: "user not exist" });
        }
      },
      function (messageFound, userFound, isUserAlreadyLiked, done) {
        console.log("Waterfall function number = 4");
        if (!isUserAlreadyLiked) {
          messageFound
            .addUser(userFound)
            .then(function (alreadyLikeFound) {
              done(null, messageFound, userFound, isUserAlreadyLiked);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to set reaction" });
            });
        } else {
          res.status(409).json({ error: "message already liked" });
        }
      },
      function (messageFound, userFound, isUserAlreadyLiked, done) {
        console.log("Waterfall function number = 5");
        messageFound
          .update({
            likes: messageFound.likes + 1,
          })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            res
              .status(500)
              .json({ error: "cannot update message like counter" });
          });
      },
      function (messageFound) {
        console.log("Waterfall function number = final");
        if (messageFound) {
          return res.status(201).json({ nice: "message liked", messageFound });
        } else {
          return res.status(500).json({ error: "cannot update message" });
        }
      },
    ]);
  },
  unlikePost: function (req, res) {
    console.log("START");
    //Getting auth header
    var headerAuth = req.headers["authorization"];
    var headerUserId = jwtUtils.getUserId(headerAuth);
    var BodyUserId = req.body.id;
    var userId = BodyUserId

    //Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
        console.log("Waterfall function number = 1");
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (messageFound, done) {
        console.log("Waterfall function number = 2");
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        } else {
          res.status(404).json({ error: "post already liked" });
        }
      },
      function (messageFound, userFound, done) {
        console.log("Waterfall function number = 3");
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId,
            },
          })
            .then(function (isUserAlreadyLiked) {
              done(null, messageFound, userFound, isUserAlreadyLiked);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify is user already liked" });
            });
        } else {
          res.status(404).json({ error: "user not exist" });
        }
      },
      function (messageFound, userFound, isUserAlreadyLiked, done) {
        console.log("Waterfall function number = 4");

        if (isUserAlreadyLiked) {
          messageFound
            .addUser(userFound)
            .then(function (alreadyLikeFound) {
              done(null, messageFound, userFound, isUserAlreadyLiked);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to set reaction" });
            });
        } else {
          res.status(409).json({ error: "message not liked" });
        }
      },
      function (messageFound, userFound, isUserAlreadyLiked, done) {
        console.log("Waterfall function number = 5");
        messageFound
          .update({
            likes: messageFound.likes - 1,
          })
          .then(function (messageFound) {
            //res.status(201).json(messageFound);
            models.Like.destroy({
              where: {
                userId: userId,
                messageId: messageId,
              },
            })
              .then(() => console.log("good"))
              .catch(() => console.log("sorry not good"));
            done(null, messageFound);
          })
          .catch(function (err) {
            console.log(err);
            res
              .status(500)
              .json({ error: "cannot update message like counter" });
          });
      },
      function (messageFound) {
        console.log("Waterfall function number = final");
        if (messageFound) {
          return res
            .status(201)
            .json({ nice: "message unliked", messageFound });
        } else {
          return res.status(500).json({ error: "cannot update message" });
        }
      },
    ]);
  },
};
