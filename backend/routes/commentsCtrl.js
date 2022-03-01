// Imports
var models = require("../models");
const asyncLib = require("async");
const jwtUtils = require("../utils/jwt.utils");

// Routes
module.exports = {
  createComment: function (req, res) {
    
    //Params
    var messageId = parseInt(req.params.messageId);
    let userId = jwtUtils.getUserId(req.cookies.cookieToken);
    let content = req.body.content;
    asyncLib.waterfall(
      [
        function (done) {//Recherche le user qui commente
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {//Recherche le message à commenter
          models.Message.findOne({
            where: { id: messageId },
          })
            .then(function (messageFound) {
              done(null, userFound, messageFound);
            })
            .catch(function (err) {
              res.status(500).json({ error: "unable to verify message" });
            });
        },
        function (userFound, messageFound, done) { //Crée le commentaire
          if (userFound) {
            models.Comment.create({
              content: content,
              messageId: messageId,
              userId: userFound.id,
            }).then(function (newComment) {
              done(null, userFound, messageFound, newComment);
            });
          } else {
            res.status(400).json({ error: "user or message not found" });
          }
        },
        function (userFound, messageFound, newComment, done) { //Incrémente de 1 le compteur de commentaire dans le message
          messageFound
            .update({
              comments: messageFound.comments + 1,
            })
            .then(function (messageFound, newComment) {
              done(messageFound, newComment);
            })
            .catch(function (err) {
              res
                .status(500)
                .json({ error: "cannot update message comment counter" });
            });
        },
      ],
      function (messageFound, newComment) {
        
        res.status(201).json({
          messageFound, 
          newComment
        });
      }
    );
  },
  listComment: function (req, res) {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    models.Comment.findAll({
      order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
    })
      .then(function (messages) {
        if (messages) {
          res.status(200).json(messages);
        } else {
          res.status(404).json({ error: "no message found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "invalid fields" });
      });
  },
};
