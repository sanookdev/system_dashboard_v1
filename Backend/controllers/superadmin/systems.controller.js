const { System, Category } = require("../../models");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  async findAll() {
    try {
      const systems = await System.findAll({
        include: [{ model: Category, as: "category" }],
      });
      return { status: true, systems };
    } catch (err) {
      return { status: false, message: err.message };
    }
  },
  async create(payload) {
    try {
      const category = await Category.findByPk(payload.category_id);
      if (!category) {
        return {
          status: false,
          message: "หมวดหมู่ไม่ถูกต้อง (category_id not found)",
        };
      }

      const newSystem = await System.create(payload);
      return {
        status: true,
        message: "สร้างระบบสำเร็จ",
        system: newSystem,
      };
    } catch (error) {
      return {
        status: false,
        message: "เกิดข้อผิดพลาด",
        error: error.message,
      };
    }
  },

  async update(id, payload) {
    try {
      const system = await System.findByPk(id);
      if (!system) {
        return { status: false, message: "ไม่พบระบบ" };
      }

      // ถ้า category_id มี ให้ตรวจสอบว่า valid
      if (payload.category_id) {
        const category = await Category.findByPk(payload.category_id);
        if (!category) {
          return { status: false, message: "category_id ไม่ถูกต้อง" };
        }
      }

      await system.update(payload);

      return {
        status: true,
        message: "อัปเดตสำเร็จ",
        system,
      };
    } catch (error) {
      return {
        status: false,
        message: "เกิดข้อผิดพลาด",
        error: error.message,
      };
    }
  },

  async remove(id) {
    try {
      const found = await System.findByPk(id);
      if (!found) return { status: false, message: "ไม่พบข้อมูล" };

      await System.destroy({ where: { id } });
      return { status: true, message: "ลบสำเร็จ" };
    } catch (error) {
      return { status: false, message: error.message };
    }
  },
};
