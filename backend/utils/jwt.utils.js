var jwt = require("jsonwebtoken");

const JWT_SIGN_SECRET = "zk4J7JgkPDhxrFeHKkTSJbBtYPp4DNqds7asBgEH";

module.exports = {
  generateTokenForUser: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: "12h",
      }
    );
  },
  parseAutho: function (autho){
    console.log("autho", autho)
    return (autho != null && autho.includes('Bearer ')) ? autho.replace('Bearer ', '') : autho ;
  },
  getUserId: function(userToken){
    var userId = -2;
    var token = module.exports.parseAutho(userToken);
    console.log(userToken);
    if(token != null){
      try{
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null){
          userId = jwtToken.userId;
        }
      }catch(err){
        console.log(err);
      }
    }
    return userId;
  },
  getUserIdHeader: function(HeaderToken){
    var userId = -3;
    var token = module.exports.parseAutho(HeaderToken);
    if(token != null){
      try{
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null){
          userId = jwtToken.userId;
          
        }
      }catch(err){
        console.log(err);
      }
    }
    return userId;
  }
};
