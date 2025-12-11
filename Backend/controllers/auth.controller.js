
const { User, employeeAuth, SystemPermission, System, Category, LoginLog, sequelize } = require("../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const recordLoginLog = async (username) => {
  try {
    const now = new Date();


    // ค้นหา username ถ้าไม่เจอให้สร้างใหม่ (created_at, lastlogin_at เป็นเวลาปัจจุบัน)
    const [log, created] = await LoginLog.findOrCreate({
      where: { username: username },
      defaults: {
        username: username,
        created_at: now,
        lastlogin_at: now
      }
    });

    // ถ้ามีอยู่แล้ว (ไม่ได้ create ใหม่) ให้อัปเดต lastlogin_at
    if (!created) {
      await log.update({ lastlogin_at: now });
    }
  } catch (error) {
    console.error("Error recording login log:", error.message);
    // ไม่ throw error เพื่อให้ user ยัง login ได้แม้ log จะพัง
  }
};

module.exports = {

  // Get all access systems of username
  async authorizeSystem(username) {
    try {
      const permissions = await SystemPermission.findAll({
        where: { employee_code: username }, // ✅ username = employee_code
        include: [
          {
            model: System,
            as: "system",
            attributes: ["id", "name", "url"],
          },
        ],
        attributes: ["isAdmin"],
      });

      return {
        ...permissions.map((p) => p.get({ plain: true })),
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      };
    }
  },

  // Check as username can access to the system and username was admin or user
  async verifySystem(username, system_id) {
    try {
      if (!username || !system_id) {
        return {
          status: false,
          status_code: 401,
          message: "เกิดข้อผิดพลาด!",
          username: username,
          system_id: system_id,
        };
      }
      const system = await System.findOne({
        where: { id: system_id }, include: [
          {
            model: Category,
            as: "category",
          },
        ],
      })
      if (!system) return { status: false, message: "System not found." }

      const plainSystem = system.get({ plain: true })

      if (!plainSystem.category.public) {
        const verify = await SystemPermission.findOne({
          where: { employee_code: username, system_id },
        });

        const plain = verify?.get({ plain: true });
        if (plain)
          return { status: true, message: "Success", ...plain };
      }

      if (plainSystem.category.public) {
        return { status: true, message: "Success", isAdmin: 0 }
      }

      return { status: false, message: "You dont have permission!" };
    } catch (error) {
      return {
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ verifySystem : auth.controller",
        error: error.message,
      };
    }
  },
  async userLogin(username, password) {
    try {
      if (!username || !password) {
        return {
          status: false,
          message: "กรุณาระบุ username และ password",
        };
      }
      const user = await employeeAuth.findOne({ where: { username } });
      if (!user) return { status: false, message: "ไม่พบผู้ใช้งาน" };

      // ✅ ตรวจสอบรหัสผ่าน
      if (password.password !== user.password) {
        return {
          status: false,
          message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
          dbpass: {
            value: user.password,
            type: typeof user.password,
          },
          password: {
            value: password,
            type: typeof password,
          },
        };
      }

      // ✅ บันทึก  log

      await recordLoginLog(user.username);

      // ✅ สร้าง token
      const token = jwt.sign(
        {
          username: user.username,
          fname: user.fname,
          lname: user.lname,
          role: "user",
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "1h" }
      );
      const userPlain = user.get({ plain: true });
      userPlain.role = "user";
      delete userPlain.password;
      return {
        status: true,
        message: "เข้าสู่ระบบสำเร็จ",
        user: userPlain,
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      };
    }
  },
  async adminLogin(username, password) {
    try {
      if (!username || !password) {
        return {
          status: false,
          message: "กรุณาระบุ username และ password",
        };
      }
      const user = await User.findOne({ where: { username } });
      if (!user) return { status: false, message: "ไม่พบผู้ใช้งาน" };

      // ✅ ตรวจสอบรหัสผ่าน
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          status: false,
          message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
        };
      }
      await recordLoginLog(user.username);

      // ✅ สร้าง token
      const token = jwt.sign(
        {
          username: user.username,
          fname: user.fname,
          lname: user.lname,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "1h" }
      );
      const userPlain = user.get({ plain: true });
      delete userPlain.password;
      return {
        status: true,
        message: "เข้าสู่ระบบสำเร็จ",
        user: userPlain,
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      };
    }
  },

  // Get username on system db !! Admin of system not user
  async findOneByUsername(username) {
    if (!username) return { status: false, message: "username is required!" };
    const user = await User.findOne({
      where: { username: username },
      attributes: { exclude: ["password"] },
    });
    return user.get({ plain: true });
  },
};

// ฟังก์ชันสร้าง superadmin ถ้ายังไม่มี
async function initSuperadmin() {
  const existingAdmin = await User.findOne({ where: { role: "superadmin" } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD,
      10
    ); // 🔐 เข้ารหัสตรงนี้

    await User.create({
      username: "admin",
      password: hashedPassword,
      fname: "Administrator",
      lname: "system",
      role: "superadmin",
    });

    console.log("✅ Superadmin created");
  } else {
    console.log("ℹ️ Superadmin already exists");
  }
}

// เรียก initSuperadmin ตอนเริ่มเซิร์ฟเวอร์s
initSuperadmin();
