// Imports
var models = require("../models");
const asyncLib = require("async");
const jwtUtils = require("../utils/jwt.utils");

// Constants
var TITLE_LIMIT = 2;
var CONTENT_LIMIT = 4;
// Routes
module.exports = {
  createMessage: function (req, res) {
    let userId = jwtUtils.getUserId(req.cookies.cookieToken);
    //Params
    var title = "Post-du-user-"+userId;
    var content = req.body.content;
    var attachment;
    
    if(req.file == undefined || req.file == null){
      if(req.body.imgURL == null || req.body.imgURL == undefined){
        attachment = null
      }else{
        attachment = req.body.imgURL
      }
    }else{
      attachment = req.file.path.replace('./public', '');
    }

    if (content == null) {
      content = ' ';
    }
    if (title.length <= TITLE_LIMIT) {
      return res.status(400).json({ error: "invalid parameters" });
    }
    asyncLib.waterfall([
        
        function(done){
            console.log('Waterfall function number = 1');
            models.User.findOne({
                where: {id: userId}
            })
            .then(function(userFound){
                done(null, userFound)
            })
            .catch(function(err){
                res.status(500).json({"error": "unable to verify user"})
            })
        },
        function(userFound, done){
            console.log('Waterfall function number = 2');
            if(userFound){
                models.Message.create({
                    title: title,
                    content: content,
                    attachment: attachment,
                    likes: 0,
                    comments: 0,
                    UserId: userFound.id 
                })
                .then(function(newMessage){
                    done(newMessage);
                })
            }else{
                res.status(400).json({"error": "user not found"})
            }
        },
    ], function(newMessage){
        console.log('Waterfall function number = final');
         if(newMessage){
             res.status(201).json(newMessage);
         }else{
             res.status(500).json({"error": "cannot post message"})
         }
    })
  },
  listMessage: function (req, res) {
      var fields = req.query.fields;
      var limit = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      var order = req.query.order;
      models.Message.findAll({
          order: [(order != null) ? order.split(":") : ["title", "ASC"]],
          attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
          limit: (!isNaN(limit)) ? limit : null,
          offset: (!isNaN(offset)) ? offset : null,
          include:[{
              model: models.User,
              attributes: ['id', 'firstname', 'lastname', 'bio']
          }]
      })
      .then(function(messages){
        if(messages){
            res.status(200).json(messages);
        }else{
            res.status(404).json({"error": "no message found"})
        }
      })
      .catch(function(err){
          res.status(500).json({"error": "invalid fields"})
      })
  },
  getOneMessage: function(req, res){
    var messageId = parseInt(req.params.messageId);
    models.Message.findOne({
      where: { id: messageId },
    })
      .then(function (messageFound) {
        if(messageFound){
          res.status(200).json(messageFound)
        }else{
          res.status(404).json({"error": "no message found"})
        }
      })
      .catch(function (err) {
        return res
          .status(500)
          .json({ error: "unable to verify message" });
      });
  
  },
  deleteMessage: function(req, res){
    let userId = jwtUtils.getUserId(req.cookies.cookieToken);
    //Params
    var messageId = parseInt(req.params.messageId);

    if (messageId <= 0) { 
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
        function (done) {
            console.log('Waterfall function number = 1');
          models.Message.findOne({
            where: { id: messageId },
          })
            .then(function (messageFound) {
              done(null, messageFound);
            })
            .catch(function (err) {
                console.log(err);
              return res
                .status(404)
                .json({ error: "unable to verify message" });
            });
        },
        function (messageFound, done) {
            console.log('Waterfall function number = 2');
          if (messageFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, userFound, messageFound);
              })
              .catch(function (err) {
                console.log(err);
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "you are not the creator of this post" });
          }
        },
        async function(userFound, messageFound, done){
            console.log("userID = ", userFound.id);
            if(userFound.id == messageFound.UserId || userFound.isModerator == 1){
                await models.Like.destroy({
                  where: {messageId}
                })
                await models.Comment.destroy({
                  where: {messageId}
                })
                models.Message.destroy({
                  where: {id: messageId},
                })
                .then(function(msgDeleted){
                  if(msgDeleted === 1){
                    return res.status(201).json({"nice": "this post has been deleted"});
                  }else{
                    return res.status(500).json({"error": "sorry it's bad :'( (else.then)"})
                  }
                })
                .catch(function(err){
                  console.log(err);
                  return res.status(500).json({"error": "sorry it's bad :'( (.catch)"})
                })
            }else{
                return res.status(500).json({"error": "sorry it's bad :'( (if_else)"})
            }
        }
    ],
    function (messageFound) {
        console.log('Waterfall function number = final');
      })
  }
};
