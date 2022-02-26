const multer = require("multer");
const path = require("path");


const fileStorageEnginePost = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/uploads/post");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() +"_"+ file.originalname);
  },
});


const uploadPost = multer({ storage: fileStorageEnginePost });


module.exports = uploadPost;
