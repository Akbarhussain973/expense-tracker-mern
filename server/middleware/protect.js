const jwt = require("jsonwebtoken");

module.exports = function protect(req, res, next) {
  console.log("=== PROTECT MIDDLEWARE ===");
  console.log("Cookies:", req.cookies);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  const token = req.cookies.token;
  console.log("Token:", token ? "Present" : "Missing");

  if (!token) {
    console.log("No token received");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("JWT Verify Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
