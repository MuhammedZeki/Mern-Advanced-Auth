const { sendVerificationEmail } = require("../mail/mails");
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
      verificationTokenExpiresAt: new Date() + 7 * 24 * 60 * 60 * 1000,
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

exports.login = async () => {
  try {
  } catch (error) {}
};
exports.logout = async () => {
  try {
  } catch (error) {}
};
exports.check = async (req, res) => {
  try {
    console.log(req);
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "[CHECK_AUTH]", error: error.message });
  }
};
