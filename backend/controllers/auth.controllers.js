const {
  sendVerificationEmail,
  sendVerifyEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mail/mails");
const { generateToken } = require("../token/jwt");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    console.log(req.body);
    function ValidateRegisterForm() {
      if (!email || !fullName || !password) {
        res.status(400).json({ message: "All fields are required" });
      }
      if (!email) res.status(400).json({ message: "Email is required" });
      if (!fullName) res.status(400).json({ message: "Name is required" });
      if (!password) res.status(400).json({ message: "Password is required" });
      if (password.length < 6)
        res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
    }
    ValidateRegisterForm();
    const emailCheck = await User.findOne({ email });
    if (emailCheck) res.status(400).json({ message: "Email is existing" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 90000
    ).toString();
    const user = new User({
      ...req.body,
      name: fullName,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    await user.save();
    generateToken(user._id, res);
    //await sendVerificationEmail(user.email, verificationToken);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({
      success: true,
      message: "Created a user account",
      user: userObj,
    });
  } catch (error) {
    console.log("ERROR-->", error.message);
    res.status(500).json({ message: "[POST_REGISTER]", error: error.message });
  }
};
exports.verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code.trim()) res.status(400).json({ message: "Code is required" });
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Code not Invalid" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    //await sendVerifyEmail(user.email, user.name);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "[VERIFY_EMAIL]",
      error: error.message,
    });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    function validateLogin() {
      if (!email || !password)
        res.status(400).json({ message: "All fields are required" });
      if (!email) res.status(400).json({ message: "Email is required" });
      if (!password) res.status(400).json({ message: "Password is required" });
    }
    validateLogin();
    const user = await User.findOne({ email });
    if (!user) res.status(400).json({ message: "User not found!" });
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      res.status(400).json({ message: "Password not Invalid" });
    user.lastLogin = new Date();
    await user.save();
    generateToken(user._id, res);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ success: true, message: "Login", user: userObj });
  } catch (error) {
    res.status(500).json({ message: "[LOGIN]", error: error.message });
  }
};
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) res.status(400).json({ message: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) res.status(400).json({ message: "User not found" });
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1saat
    await user.save();
    sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/${resetToken}`
    );
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({
      message: true,
      message: "[FORGET_PASSWORD]",
      error: error.message,
    });
  }
};
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!password) res.status(400).json({ message: "Password is required!" });
    if (password.length < 6)
      res.status(400).json({ message: "Passsword must be at least 6 Char." });
    const _token = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!_token) res.status(400).json({ message: "Invalid token" });
    const hashedPassword = await bcrypt.hash(password, 10);
    _token.password = hashedPassword;
    _token.resetPasswordToken = undefined;
    _token.resetPasswordExpiresAt = undefined;
    await _token.save();
    await sendResetSuccessEmail(_token.email);
    res.status(200).json({ success: true, message: "Password reset success" });
  } catch (error) {
    res.status(500).json({ message: "[RESET_PASSWORD]", error: error.message });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "LOGOUT", error: error.message });
  }
};
exports.check = async (req, res) => {
  try {
    console.log(req);
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "[CHECK_AUTH]", error: error.message });
  }
};
