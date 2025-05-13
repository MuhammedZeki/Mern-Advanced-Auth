const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      res.status(400).json({ message: "Unauthorized - No Token Provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (!decoded)
      res.status(400).json({ message: "Unauthorized - Invalid Token" });
    const user = await User.findById(decoded._id).select("-password");
    if (!user) res.status(400).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({ message: "[PROTECT_ROUTES]", error: error.message });
  }
};
