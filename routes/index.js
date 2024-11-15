const express = require("express");
const router = express.Router();
const multer = require("multer"); //install: npm i multer

const uploadDestination = "uploads";

// show - where save files
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

router.get("/register", (req, res) => {
  res.send("register");
});

module.exports = router;
