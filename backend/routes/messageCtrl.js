// Imports
var models = require("../models");
const asyncLib = require("async");
const jwtUtils = require("../utils/jwt.utils");
const { LocalFireDepartment } = require("@mui/icons-material");

// Constants
var TITLE_LIMIT = 2;
var CONTENT_LIMIT = 4;
// Routes
module.exports = {
  createMessage: function (req, res) {
    //Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    //Params
    var title = req.body.title;
    var content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ error: "missing parameters" });
    }
    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
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
                    likes: 0,
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
              attributes: ['firstname', 'lastname']
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
          console.log(err);
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
          console.log(err);
        return res
          .status(500)
          .json({ error: "unable to verify message" });
      });
  
  },
  deleteMessage: function(req, res){
    console.log('START');
    //Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    //Params
    var messageId = parseInt(req.params.messageId);
    console.log('messageID= ', messageId);

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
                console.log("messageUserId Water1= ",messageFound.UserId);
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
            console.log("messageUserId Water2= ",messageFound.UserId);
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
        function(userFound, messageFound, done){
            console.log("userID = ", userFound.id);
            console.log("message.userId Water3 = ", messageFound.UserId);
            if(userFound.id == messageFound.UserId){
                //return res.status(201).json({'nice': "it's good"})
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
          if(messageFound){
              return res.status(201).json({"nice": "this post has been deleted"});
          }else{
              return res.status(500).json({'error': 'cannot update message'})
          }
      })
  }
};
