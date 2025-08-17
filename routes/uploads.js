const express = require("express");
const {
  uploadImage,
  deleteImage,
  getAllImages,
} = require("../controllers/uploadsController");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), uploadImage);

router.delete("/delete/:publicId", deleteImage);
router.get("/readImages", getAllImages);

module.exports = router;
