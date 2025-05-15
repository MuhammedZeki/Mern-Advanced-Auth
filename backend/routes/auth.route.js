const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth.controllers");
const { protectRoute } = require("../middleware/protectRoutes");
const router = express.Router();

router.get("/check", protectRoute);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
