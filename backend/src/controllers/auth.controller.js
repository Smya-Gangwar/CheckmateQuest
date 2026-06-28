const authService = require("../services/auth.service");

const {
  generateToken,
} = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await authService.loginAdmin(email, password);
    const token = generateToken(admin);

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    res.status(401).json({error: error.message});
  }
};

module.exports = {
  login,
};