const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");

const loginAdmin = async (email, password) => {
  const admin = await prisma.admin.findUnique({
    where: {
        email,
    },
  });
  if (!admin) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(
    password,
    admin.hashed_password
  );

  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  return admin;
};

module.exports = {
  loginAdmin,
};