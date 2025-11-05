const { Category, System, CategoryPermission, SystemPermission } = require("../../models");
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
  async findAllByEmployee(employee_code) {
    try {

      const categories = await Category.findAll({
        include: [
          // 1) ต้องมี CategoryPermission ของ employee_code นี้
          {
            model: CategoryPermission,
            as: "permissions",
            where: { employee_code },
            required: true,                         // ถ้าไม่มี permission ไม่เอา category นี้
            attributes: [],                         // ไม่ต้องรีเทิร์น field ก็ได้ ถ้าไม่ใช้
          },
          // 2) ภายใน category นี้ ดึงเฉพาะ systems ที่ user มี SystemPermission
          {
            model: System,
            as: "systems",
            required: true,                         // ไม่มี system ที่มีสิทธิ์ ก็ไม่เอา category นี้
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
            include: [
              {
                model: SystemPermission,
                as: "systemPermissions",           // ต้องตรงกับ alias ใน models/index.js
                where: { employee_code },
                required: true,                    // ไม่มี system_permission ก็ไม่เอา system นี้
                attributes: [],
              },
            ],
          },
        ],
        order: [
          ["name", "ASC"],
          [{ model: System, as: "systems" }, "name", "ASC"],
        ],
      });

      return { status: true, categories };
    } catch (error) {
      console.error("findAllByEmployee error", error);
      return {
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      };
    }
  },
};
