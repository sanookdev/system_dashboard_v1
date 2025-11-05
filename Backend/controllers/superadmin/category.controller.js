const { Category, System, CategoryPermission } = require("../../models");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  async findAll() {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: System,
            as: "systems",
            attributes: [
              "id",
              "icon",
              "name",
              "description",
              "url",
              "owner_department",
              "created_at",
              "created_by",
              "updated_at",
            ],
          },
          {
            model: CategoryPermission,
            as: "permissions", // ✅ alias ต้องตรงกับ hasMany
            attributes: ["id", "employee_code", "created_by", "created_at"],
          },
        ],
      });
      return { status: true, categories };
    } catch (error) {
      console.error("findAll error", error);
      return {
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      };
    }
  },
  async create(payload) {
    try {
      const result = await Category.create(payload);
      return { status: true, message: "เพิ่มสำเร็จ", data: result };
    } catch (error) {
      return { status: false, message: error.message };
    }
  },

  async update(id, payload) {
    try {
      const found = await Category.findByPk(id);
      if (!found) return { status: false, message: "ไม่พบข้อมูล" };

      await Category.update(payload, { where: { id } });
      return { status: true, message: "อัปเดตสำเร็จ" };
    } catch (error) {
      return { status: false, message: error.message };
    }
  },

  async remove(id) {
    try {
      const found = await Category.findByPk(id);
      if (!found) return { status: false, message: "ไม่พบข้อมูล" };

      await Category.destroy({ where: { id } });
      return { status: true, message: "ลบหมวดหมู่เรียบร้อยแล้ว" };
    } catch (error) {
      return { status: false, message: error.message };
    }
  },
};
