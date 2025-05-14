const { sendVerificationEmail, sendVerifyEmail } = require("../mail/mails");
const User = require("../models/user.model");
const { generateToken } = require("../token/jwt");
const bcrypt = require("bcryptjs");
exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    function ValidateRegisterForm() {
      if (!email || !name || !password) {
        res.status(400).json({ message: "All fields are reguired" });
      }
      if (!email) res.status(400).json({ message: "Email is required" });
      if (!name) res.status(400).json({ message: "Name is required" });
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
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    await user.save();
    generateToken(user._id, res);
    await sendVerificationEmail(user.email, verificationToken);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({
      success: true,
      message: "Created a user account",
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ message: "[POST_REGISTER]", error: error.message });
  }
};
exports.verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    console.log(code);
    if (!code.trim()) res.status(400).json({ message: "Code is required" });
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Code not Invalid" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendVerifyEmail(user.email, user.name);
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
exports.login = async () => {
  try {
  } catch (error) {}
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
