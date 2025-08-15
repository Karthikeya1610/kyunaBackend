
const express = require("express");
const { registerUser, registerAdmin } = require("../controllers/authController");

const router = express.Router();


router.post("/user/register", registerUser);

router.post("/admin/register", registerAdmin);

module.exports = router;
