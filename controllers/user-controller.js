const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

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
      const png = jdenticon.toPng(name, 200); //generate img
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, "/../uploads", avatarName);
      fs.writeFileSync(avatarPath, png);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl: `/uploads/${avatarPath}`,
        },
      });

      res.json(user);
    } catch (error) {
      console.error("Error in register", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "all fields are required" });
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res
          .status(400)
          .json({ error: "you entered an incorrect login or password" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res
          .status(400)
          .json({ error: "you entered an incorrect login or password" });
      }
      //We encrypt the user ID in the token //npm i dotenv for work process.env.SECRET_KEY
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      res.json({ token });
    } catch (error) {
      console.error("login error", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
