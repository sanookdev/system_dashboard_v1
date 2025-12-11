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
              "sso",
              "sso_code",
              "public"
            ],
            include: [
              {
                model: SystemPermission,
                as: "systemPermissions",
                required: false,
                where: { employee_code: employee_code },
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

      // ====== Logic หลังดึงมา ======
      const result = categories.map((cat) => {
        const c = cat.toJSON();

        // กรอง systems ตามเงื่อนไขใหม่
        const systems = (c.systems || []).filter((sys) => {
          // เงื่อนไขที่ 1: ถ้า System เป็น Public (1) -> ให้แสดงได้เลย
          if (sys.public === 1) {
            return true;
          }

          // เงื่อนไขที่ 2: ถ้า System ไม่ใช่ Public (0) -> ต้องมี permission
          // เราเช็คจาก systemPermissions ที่ join มา ถ้ามีข้อมูล (length > 0) แปลว่า user นี้มีสิทธิ์

          return sys.systemPermissions && sys.systemPermissions.length > 0;
        });

        return {
          id: c.id,
          name: c.name,
          public: c.public,
          systems: systems, // ส่ง systems ที่กรองแล้วกลับไป
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
      // 1. Query DB (ส่วนนี้ถูกต้องแล้วครับ ใช้ include แบบ required: false)
      const categories = await Category.findAll({
        attributes: ["id", "name", "public"],
        where: {
          [Op.or]: [
            { public: 1 },
            { "$permissions.employee_code$": employee_code },
          ],
        },
        include: [
          {
            model: CategoryPermission,
            as: "permissions",
            required: false,
            attributes: [],
          },
          {
            model: System,
            as: "systems",
            required: false,
            attributes: [
              "id", "icon", "name", "description", "url",
              "owner_department", "created_at", "created_by",
              "updated_at", "img_icon", "sso", "sso_code", "public"
            ],
            include: [
              {
                model: SystemPermission,
                as: "systemPermissions",
                required: false,
                where: { employee_code: employee_code }, // ดึง Permission ของเรามาเตรียมไว้ (ถ้ามี)
                attributes: ["employee_code"],
              },
            ],
          },
        ],
        order: [
          ["id", "ASC"],
          [{ model: System, as: "systems" }, "id", "ASC"],
        ],
        subQuery: false,
      });

      const results = categories.map((cat) => {
        const c = cat.toJSON();

        // เราจะไม่เช็ค c.public (หมวดหมู่) เพื่อเหมา systems 
        // แต่จะเจาะจงเช็คทีละ system เลย เพื่อความชัวร์และถูกต้อง
        const systems = (c.systems || []).filter((sys) => {

          // ✅ 1. ถ้า Public = 1 "ดึงมาเลย" (ตามที่คุณต้องการ)
          // จบตรงนี้เลย ไม่ต้องไปเช็ค permission ต่อ

          if (sys.public) {
            return true;
          }

          // ✅ 2. ถ้า Public = 0 ค่อยมาเช็ค Permission
          // ถ้ามีข้อมูลใน systemPermissions (ที่ join มา) แปลว่ามีสิทธิ์
          return sys.systemPermissions && sys.systemPermissions.length > 0;
        });

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
