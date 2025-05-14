const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
} = require("../controllers/auth.controllers");
const { protectRoute } = require("../middleware/protectRoutes");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.get("/check", protectRoute);
module.exports = router;
