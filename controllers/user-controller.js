const { prisma } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "all fields are required" });
    }
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: "the user already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {}
  },
  login: async (req, res) => {
    res.send("login");
  },
  getUserById: async (req, res) => {
    res.send("getUserById");
  },
  updateUser: async (req, res) => {
    res.send("updateUser");
  },
  current: async (req, res) => {
    res.send("current");
  },
};

module.exports = UserController;
