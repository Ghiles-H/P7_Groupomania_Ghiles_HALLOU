//Imports
var models = require("../models");
var jwtUtils = require("../utils/jwt.utils");
var asyncLib = require("async");

//Constants

//Routes
module.exports = {
  likePost: function (req, res) {
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

    asyncLib.waterfall(
      [
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
                .status(500)
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
                done(null, messageFound, userFound);
              })
              .catch(function (err) {
                console.log(err);
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (messageFound, userFound, done) {
            console.log('Waterfall function number = 3');
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
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "unable to verify is user already liked" });
              });
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function(messageFound, userFound, isUserAlreadyLiked, done){
            console.log('Waterfall function number = 4');
            if(!isUserAlreadyLiked){
                messageFound.addUser(userFound)
                .then(function(alreadyLikeFound){
                    done(null, messageFound, userFound, isUserAlreadyLiked);
                })
                .catch(function(err){
                    console.log(err);
                    return res.status(500).json({'error': 'unable to set reaction'});
                });
            }else{
                res.status(409).json({'error': 'message already liked'});
            }
        },
        function(messageFound, userFound, done){
            console.log('Waterfall function number = 5');
            messageFound.update({
                likes: messageFound.likes + 1,
            })
            .then(function(messageFound){
                res.status(201).json(messageFound);   //done(messageFound);
            })
            .catch(function(err){
                console.log(err);
                res.status(500).json({'error': 'cannot update message like counter'});
            })
        },
      ],
      function (messageFound) {
        console.log('Waterfall function number = final');
          if(messageFound){
              return res.status(201).json(messageFound);
          }else{
              return res.status(500).json({'error': 'cannot update message'})
          }
      }
    );
    
  },
};
