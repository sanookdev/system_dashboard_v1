const { ExternalUser, employeeAuth } = require("../../models");
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

      const cleanUsername = String(username).trim();
      const cleanPassword = String(password).trim();

      const existingUser = await ExternalUser.findOne({ where: { username: cleanUsername } });
      if (existingUser) {
        return res.status(400).json({ status: false, message: "Username already exists in external users" });
      }

      const existingEmployee = await employeeAuth.findOne({ where: { username: cleanUsername } });
      if (existingEmployee) {
        return res.status(400).json({ status: false, message: "Username already exists in employee system" });
      }

      const hashedPassword = await bcrypt.hash(cleanPassword, 10);

      const newUser = await ExternalUser.create({
        username: cleanUsername,
        password: hashedPassword,
        fname: fname ? String(fname).trim() : null,
        lname: lname ? String(lname).trim() : null,
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

      const hashedPassword = await bcrypt.hash(String(password).trim(), 10);
      await user.update({ password: hashedPassword });

      return res.status(200).json({ status: true, message: "Password reset successfully" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async importUsers(req, res) {
    try {
      const { users } = req.body;
      if (!users || !Array.isArray(users)) {
        return res.status(400).json({ status: false, message: "Invalid data format" });
      }

      let successList = [];
      let failedList = [];

      for (const userData of users) {
        const { username, password, fname, lname } = userData;
        if (!username || !password) {
          failedList.push({ username: username || "ไม่ระบุ", reason: "ข้อมูลไม่ครบถ้วน (ต้องการ username และ password)" });
          continue;
        }

        const cleanUsername = String(username).trim();
        const cleanPassword = String(password).trim();

        const existingUser = await ExternalUser.findOne({ where: { username: cleanUsername } });
        if (existingUser) {
          failedList.push({ username: cleanUsername, reason: "มีผู้ใช้ภายนอกชื่อนี้อยู่แล้ว" });
          continue;
        }

        const existingEmployee = await employeeAuth.findOne({ where: { username: cleanUsername } });
        if (existingEmployee) {
          failedList.push({ username: cleanUsername, reason: "มีชื่อผู้ใช้นี้ในระบบพนักงานหลักแล้ว" });
          continue;
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10);
        await ExternalUser.create({
          username: cleanUsername,
          password: hashedPassword,
          fname: fname ? String(fname).trim() : null,
          lname: lname ? String(lname).trim() : null,
          is_active: true,
        });
        successList.push({ username: cleanUsername });
      }

      return res.status(200).json({
        status: true,
        message: `Import completed. Created: ${successList.length}, Skipped: ${failedList.length}`,
        data: { successList, failedList }
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
};
