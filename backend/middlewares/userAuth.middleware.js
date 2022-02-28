const jwt = require("jsonwebtoken");
const models = require("../models");

const JWT_SIGN_SECRET = "zk4J7JgkPDhxrFeHKkTSJbBtYPp4DNqds7asBgEH";

module.exports = {
  checkUser: function (req, res, next) {
    console.log("CHECK USER");
    const token = req.cookies.cookieToken;

    if (token) {
      jwt.verify(token, JWT_SIGN_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await models.User.findOne({
            attributes: ["id", "email", "firstname", "lastname", "imgUrl"],
            where: { id: decodedToken.userId },
          });
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  },
  requireAuth: function (req, res, next) {
    const token = req.cookies.cookieToken;
    if (token) {
      jwt.verify(token, JWT_SIGN_SECRET, async (err, decodedToken) => {
        if (err) {
          res.status(200).json({ err });
        } else {
          next();
        }
      });
    } else {
      console.log("No token");
      return res.status(403).json({ error: "erreur d'authentification" });
    }
  },
};
