const { mode } = require("crypto-js");
const { SystemPermission, System } = require("../../models");
require("dotenv").config();

module.exports = {
  async findAll() {
    try {
      const permissionListRaw = await SystemPermission.findAll({
        include: [
          {
            model: System,
            as: "system",
            attributes: ["id", "name", "url"],
          },
        ],
      });
      const permissionList = permissionListRaw.map((item) => {
        const plain = item.get({ plain: true });
        return {
          ...plain,
          system_name: plain.system?.name || null,
        };
      });
      return { status: true, permissionList };
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
      const { employee_code, system_id } = payload;

      const system = await System.findByPk(system_id);
      if (!system) {
        return {
          status: false,
          message: "ระบบที่เลือกไม่ถูกต้อง (system_id not found)",
        };
      }

      const exists = await SystemPermission.findOne({
        where: { employee_code, system_id },
      });

      if (exists) {
        return {
          status: false,
          status_code: 409,
          message: "ผู้ใช้งานมีสิทธิ์ในระบบนี้อยู่แล้ว",
        };
      }
      const result = await SystemPermission.create(payload);
      return {
        status: true,
        message: "กำหนดสิทธิ์ผู้ใช้งานเรียบร้อยแล้ว",
        newPermission: result,
      };
    } catch (error) {
      return {
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      };
    }
  },
  async updateByEmployeeCode(employee_code, isAdmin, system_id, updated_by) {
    try {
      const whereObj = { employee_code: employee_code, system_id: system_id }
      const found = await SystemPermission.findOne({ where: { ...whereObj } });
      if (!found) return { status: false, message: "ไม่พบข้อมูล" };

      await SystemPermission.update({ isAdmin: isAdmin, updated_by: updated_by }, { where: { ...whereObj } });
      return { status: true, message: "อัปเดตสำเร็จ" };
      return {
        employee_code: employee_code,
        isAdmin: isAdmin,
        system_id: isAdmin
      }
    } catch (error) {
      return {
        status: false,
        message: "เกิดข้อผิดพลาด updateByEmployeeCode in Controller file",
        error: error.message
      }
    }
  }
};
