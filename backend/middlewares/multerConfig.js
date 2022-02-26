const multer = require("multer");
const path = require("path");

const fileStorageEngineProfil = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/uploads/profil");
  },
  filename: (req, file, callback) => {
    const userId = req.params.id;
    callback(null, "imgProfilUser_" + userId + ".jpg");
  },
});


const uploadProfil = multer({ storage: fileStorageEngineProfil });


module.exports = uploadProfil;
