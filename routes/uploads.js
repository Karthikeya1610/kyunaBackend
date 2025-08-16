const express = require("express");
const {
  uploadImage,
  deleteImage,
} = require("../controllers/uploadsController");
const multer = require("multer");


const router = express.Router();

router.post("/upload", uploadImage);
router.delete("/delete/:publicId", deleteImage);

module.exports = router;
