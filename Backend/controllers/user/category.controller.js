const { Category, System, CategoryPermission, SystemPermission, Sequelize } = require("../../models");
const { Op } = Sequelize;
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  async findAll() {
    try {
      const categories = await Category.findAll({
        attributes: ["id", "name", "public"],
        where: {
          [Op.or]: [
            { public: 1 },                                // ใครก็เห็นได้
            {
              public: 0,
              "$permissions.employee_code$": employee_code
            }
          ],
        },
        include: [
          {
            model: CategoryPermission,
            as: "permissions",
            required: true,   // ไม่บังคับ join เพื่อให้ public category โชว์ด้วย
            where: { employee_code },
            attributes: [],
          },
          {
            model: System,
            as: "systems",
            required: false,   // ให้ category โชว์ได้แม้ยังไม่มีระบบ
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
              "img_icon",
              "sso"
            ],
            include: [
              {
                model: SystemPermission,
                as: "systemPermissions",
                required: false,
                where: { employee_code },
                attributes: [],
              },
            ],
          },
        ],
        order: [
          ["name", "ASC"],
          [{ model: System, as: "systems" }, "name", "ASC"],
        ],
        subQuery: false,
      });

      // ====== Logic หลังดึงมา ======
      categories.map((cat) => {
        const c = cat.toJSON();

        const systems =
          c.public === 1
            ? c.systems || [] // public = 1 → แสดงทุกระบบ
            : (c.systems || []).filter(
              (sys) => (sys.systemPermissions || []).length > 0
            ); // public = 0 → แสดงเฉพาะระบบที่มีสิทธิ์

        // public = 0 แต่มี CategoryPermission ก็ต้องโชว์แม้ไม่มี systems
        return {
          id: c.id,
          name: c.name,
          public: c.public,
          systems,
        };
      });
      return { status: true, result };
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
        attributes: ["id", "name", "public"],
        where: {
          // ✅ เลือก category จาก 2 เงื่อนไขนี้เท่านั้น
          [Op.or]: [
            { public: 1 },                              // public เห็นได้ทุกคน
            { "$permissions.employee_code$": employee_code }, // private แต่ user มีสิทธิ์
          ],
        },
        include: [
          {
            model: CategoryPermission,
            as: "permissions",
            required: false,        // ❗ ต้อง false
            attributes: [],
          },
          {
            model: System,
            as: "systems",
            required: false,        // ❗ ตรงนี้สำคัญสุด ถ้า true category ที่ไม่มี system จะหาย
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
              "img_icon",
              "sso"
            ],
            include: [
              {
                model: SystemPermission,
                as: "systemPermissions",
                required: false,    // ใช้ไว้ filter ทีหลัง
                attributes: ["employee_code"],
              },
            ],
          },
        ],
        order: [
          ["name", "ASC"],
          [{ model: System, as: "systems" }, "name", "ASC"],
        ],
        subQuery: false,
      });

      // =========== จัดรูปผลลัพธ์ตาม rule ===========

      const results = await categories.map((cat) => {
        const c = cat.toJSON();

        // public = 1 → เอาทุก system
        // public = 0 → เอาเฉพาะ system ที่ user มี system_permission
        const systems =
          c.public === 1
            ? (c.systems || [])
            : (c.systems || []).filter((sys) =>
              (sys.systemPermissions || []).some(
                (sp) => sp.employee_code === employee_code
              )
            );

        return {
          id: c.id,
          name: c.name,
          public: c.public,
          systems,
        };
      });

      return { status: true, categories: results };
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
