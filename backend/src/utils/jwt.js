const jwt = require("jsonwebtoken");

const generateToken = (admin) => {
  return jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
    },
    // process.env.JWT_SECRET is your_secret_key
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateToken,
};