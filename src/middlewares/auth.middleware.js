const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // Expect: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, Token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User Not Authorized" });
    }
    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
