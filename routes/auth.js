const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  res.json({ message: "User registered successfully" });
});

router.post("/login", (req, res) => {
  res.json({
    message: "User login endpoint",
  });
});
router.get("/profile", (req, res) => {
  res.json({
    message: "User profile endpoint",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
