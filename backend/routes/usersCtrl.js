//Imports
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models");
const asyncLib = require("async");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

//Constants
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASS_REGEX = /^(?=.*\d).{4,8}$/;
const maxAge = 12 * 60 * 60 * 1000; // maxAge = 12h
const maxAge4 = 10000;

//Routes
module.exports = {
  register: function (req, res) {
    //Params
    var email = req.body.email;
    var firstname = req.body.firstName;
    var lastname = req.body.lastName;
    var imgUrl = req.body.imgUrl;
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
      return res.status(400).json({ error: "email is not valid" });
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
            firstname: firstname,
            lastname: lastname,
            password: bcryptedPassword,
            imgUrl: imgUrl,
            isAdmin: 0,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              console.log(err);
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
          const jwToken = jwtUtils.generateTokenForUser(userFound);
          res.cookie("cookieToken", jwToken, { httpOnly: true, maxAge });
          res.header("authorization", jwToken);
          return res.status(201).json({
            userId: userFound.id,
            userFirstName: userFound.firstname,
            userLastName: userFound.lastname,
            token: jwToken,
          });
        } else {
          return res.status(500).json({ error: "cannot log on user" });
        }
      }
    );
  },
  getAllUsers: function (req, res) {
    models.User.findAll({
      attributes: ["id", "email", "firstname", "lastname", "bio", "imgUrl"],
    })
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((err) => console.log(err));
  },
  getUserProfile: function (req, res) {
    //Getting auth header
    const cookieAuth = req.cookies.cookieToken;
    const headerAuth = req.headers["authorization"];
    let token = null;
    if (cookieAuth) {
      token = cookieAuth;
    } else {
      token = headerAuth;
      console.log("header=", headerAuth);
    }
    let userId = -1;
    userId = jwtUtils.getUserId(token);

    if (userId < 0) {
      console.log("ERREUR");
      console.log("USER ID ", userId); // if(userId = -1) => cookie+header = null; if(userId = -2) => pb cookie; if(userId = -3) => pb header

      console.log("END");
      return res.status(401).json({ error: "wrong token." });
    } else {
      console.log("SUCCESS");
      console.log("USER ID ", userId);

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
    console.log("END");
  },
  getUserInfo: function (req, res) {
    const cookieAuth = req.cookies.cookieToken;
    const userId = jwtUtils.getUserId(cookieAuth);
    //const userId = req.params.id;
    models.User.findOne({
      attributes: [
        "id",
        "email",
        "firstname",
        "lastname",
        "imgUrl",
        "bio",
        "isModerator",
        "createdAt",
      ],
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          return res.status(201).json(user);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch user" });
      });
  },
  updateUserProfile: function (req, res) {
    //Getting auth header
    const cookieAuth = req.cookies.cookieToken;
    var userIdCookie = jwtUtils.getUserId(cookieAuth);
    var userIdParams = req.params.id;
    let userId;

    console.log("cookie", cookieAuth);
    console.log("params", userIdParams);
    if (userIdCookie) {
      userId = userIdCookie;
    } else {
      return res.status(403).json({ error: "unable to verify user" });
    }

    //Params
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var bio = req.body.bio;
    var city = req.body.city;
    var job = req.body.job;
    var imgUrl = req.body.imgUrl;

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: [
              "id",
              "firstname",
              "lastname",
              "bio",
              "imgUrl",
            ],
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
                firstname: firstname ? firstname : userFound.firstname,
                lastname: lastname ? lastname : userFound.lastname,
                imgUrl: imgUrl ? imgUrl : userFound.imgUrl,
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
  updateImgProfil: async function (req, res) {
    let userId = jwtUtils.getUserId(req.cookies.cookieToken);
    try {
      asyncLib.waterfall(
        [
          function (done) {
            models.User.findOne({
              attributes: ["id", "imgUrl"],
              where: { id: userId },
            })
              .then(function (userFound) {
                console.log("imgUrl=", userFound.imgUrl);
                done(null, userFound);
              })
              .catch(function (err) {
                console.log("err findOne", err);
                return res.status(500).json({ error: "unable to verify user" });
              });
          },
          function (userFound, done) {
            if (userFound) {
              console.log("REQFILE", req.file);
              const reqFilePath = req.file.path;
              userFound
                .update({
                  imgUrl: reqFilePath.replace(`./public`, ""),
                })
                .then(function () {
                  done(userFound);
                })
                .catch(function (err) {
                  console.log("err update", err);
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
            return res
              .status(500)
              .json({ error: "cannot update user profile" });
          }
        }
      );
    } catch (err) {
      console.log("err userfound", err);
      return res.status(300).send({ message: err });
    }
  },

  deleteUser: async function (req, res) {
    let userId = jwtUtils.getUserId(req.cookies.cookieToken);
    if (userId < 0) {
      return res.status(400).json({ error: "wrong token" });
    } else {
      //Delete Likes
      await models.Like.findAll({
        attributes: ["messageId"],
        where: { userId },
      })
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          models.Message.findOne({
            where: res[i].dataValues.messageId,
          }).then(function (msgFound) {
            msgFound.update({
              likes: msgFound.likes - 1,
            });
          });
        }
      });
      await models.Like.destroy({
        where: { userId },
      });

      //Delete Comments
      await models.Comment.findAll({
        attributes: ["messageId"],
        where: { userId },
      }).then((res) => {
        for (let i = 0; i < res.length; i++) {
          models.Message.findOne({
            where: res[i].dataValues.messageId,
          }).then(function (msgFound) {
            msgFound.update({
              comments: msgFound.comments - 1,
            });
          });
        }
      });
      await models.Comment.destroy({
        where: { userId },
      });
      //Delete Messages
      await models.Message.destroy({
        where: {userId}
      });
      //Delete User
      models.User.destroy({
        where: { id: userId },
      })
        .then(function (rowDeleted) {
          if (rowDeleted === 1) {
            res.status(201).json("Le user a été supprimé");
          } else {
            res.status(404).json({ error: "user not found" });
          }
        })
        .catch(function (err) {
          res.status(500).json({ error: "cannot fetch user" });
        });
    }
  },
  logout: function (req, res) {
    res.cookie("cookieToken", "", { httpOnly: true, maxAge: 1 });
    return res.status(200).json("Logout Success");
  },
};
