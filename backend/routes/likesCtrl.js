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
    let userId = jwtUtils.getUserId(req.cookies.cookieToken);
    
   

    //Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
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
        if (messageFound) {
          return res.status(201).json({ nice: "message liked", messageFound });
        } else {
          return res.status(500).json({ error: "cannot update message" });
        }
      },
    ]);
  },
  unlikePost: function (req, res) {
    let userId = jwtUtils.getUserId(req.cookies.cookieToken);
    //Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
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
            done(null, messageFound);
          })
          .catch(function (err) {
            res
              .status(500)
              .json({ error: "cannot update message like counter" });
          });
      },
      function (messageFound) {
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
