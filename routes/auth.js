
const express = require("express");
const { registerUser, registerAdmin , login} = require("../controllers/authController");


const router = express.Router();


router.post("/user/register", registerUser);
router.post("/admin/register", registerAdmin);
router.post("/login", login);

module.exports = router;
