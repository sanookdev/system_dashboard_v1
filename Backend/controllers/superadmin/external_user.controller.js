const { ExternalUser } = require("../../models");
const bcrypt = require("bcrypt");

module.exports = {
  async findAll(req, res) {
    try {
      const users = await ExternalUser.findAll({
        attributes: { exclude: ["password"] },
        order: [["created_at", "DESC"]],
      });
      return res.status(200).json({ status: true, data: users });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { username, password, fname, lname, is_active } = req.body;
      if (!username || !password) {
        return res.status(400).json({ status: false, message: "Username and password are required" });
      }

      const existingUser = await ExternalUser.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ status: false, message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await ExternalUser.create({
        username,
        password: hashedPassword,
        fname,
        lname,
        is_active: is_active !== undefined ? is_active : true,
      });

      const userPlain = newUser.get({ plain: true });
      delete userPlain.password;

      return res.status(201).json({ status: true, message: "Created successfully", data: userPlain });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { username } = req.params;
      const { fname, lname, is_active } = req.body;

      const user = await ExternalUser.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      await user.update({ fname, lname, is_active });

      const userPlain = user.get({ plain: true });
      delete userPlain.password;

      return res.status(200).json({ status: true, message: "Updated successfully", data: userPlain });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { username } = req.params;
      const user = await ExternalUser.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      await user.destroy();
      return res.status(200).json({ status: true, message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { username } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ status: false, message: "New password is required" });
      }

      const user = await ExternalUser.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await user.update({ password: hashedPassword });

      return res.status(200).json({ status: true, message: "Password reset successfully" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
};
