const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided",
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    req.admin = decoded;
    // next() is called to proceed to the next middleware or route handler which is the protected route
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

module.exports = {
  authenticateAdmin,
};