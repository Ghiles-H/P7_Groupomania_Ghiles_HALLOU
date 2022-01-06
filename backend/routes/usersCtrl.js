//Imports
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models");
const asyncLib = require("async");

//Constants
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASS_REGEX = /^(?=.*\d).{4,8}$/;

//Routes
module.exports = {
  register: function (req, res) {
    //Params
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    //Verification des parametres

    if (firstname.length >= 20 || lastname.length >= 20) {
      return res.status(400).json({
        error: "wrong firstname and/or lastname (must be length < 20)",
      });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "email is not walid" });
    }
    if (!PASS_REGEX.test(password)) {
      return res.status(400).json({
        error:
          "password invalid (must length 4 - 8 and include minimum 1 number at least",
      });
    }
    //Verifcaton de l'unitité du user via l'email
    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function (err, bcryptedPassword) {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: "user already exist" });
          }
        },
        function (userFound, bcryptedPassword, done) {
          var newUser = models.User.create({
            email: email,
            username: username,
            password: bcryptedPassword,
            isAdmin: 0,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "cannot add user" });
            });
        },
      ],
      function (newUser) {
        if (newUser) {
          return res.status(201).json({
            userId: newUser.id,
          });
        } else {
          return res.status(500).json({ error: "cannot add user" });
        }
      }
    );
  },
  login: function (req, res) {
    //Params
    var email = req.body.email;
    var password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    //Waterfall
    asyncLib.waterfall(
      [
        //Fonction One
        function (done) {
          models.User.findOne({
            //Verification de la présence du user dans la database
            where: { email: email },
          })
            .then(function (userFound) {
              //User présent => passage à la fct suivante
              done(null, userFound); //null permet de passer à la fct suivante
            })
            .catch(function (err) {
              //User non présent => affichage d'un msg d'erreur
              return res.status(500).json({ error: "unable to verify user" });
            });
        },

        //Fonction Two
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(
              password,
              userFound.password,
              function (errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
              }
            );
          } else {
            return res.status(404).json({ error: "user not exist in DB" });
          }
        },

        //Fonction Three
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "invalid password" });
          }
        },
      ],
      function (userFound) {
        //Fct primaire du waterfall
        if (userFound) {
          return res.status(201).json({
            userId: userFound.id,
            userFirstName: userFound.firstname,
            userLastName: userFound.lastname,
            token: jwtUtils.generateTokenForUser(userFound),
          });
        } else {
          return res.status(500).json({ error: "cannot log on user" });
        }
      }
    );
  },
  getUserProfile: function (req, res) {
    //Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
      console.log("USER ID ", userId);
      console.log("HEADERAUTH ", req.headers["authorization"]);
      return res.status(400).json({ error: "wrong token" });
    } else {
      models.User.findOne({
        attributes: [
          "id",
          "email",
          "firstname",
          "lastname",
          "bio",
          "city",
          "job",
        ],
        where: { id: userId },
      })
        .then(function (user) {
          if (user) {
            res.status(201).json(user);
          } else {
            res.status(404).json({ error: "user not found" });
          }
        })
        .catch(function (err) {
          res.status(500).json({ error: "cannot fetch user" });
        });
    }
  },
  updateUserProfile: function (req, res) {
    //Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    //Params
    var bio = req.body.bio;
    var city = req.body.city;
    var job = req.body.job;

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["id", "bio", "city", "job"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                bio: bio ? bio : userFound.bio,
                city: city ? city : userFound.city,
                job: job ? job : userFound.job,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "cannot update user" });
              });
          } else {
            return res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "cannot update user profile" });
        }
      }
    );
  },
};
