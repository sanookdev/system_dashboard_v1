const { ExternalDepartment } = require("../../models");

module.exports = {
  async findAll(req, res) {
    try {
      const departments = await ExternalDepartment.findAll({
        order: [["code", "ASC"]],
      });
      return res.status(200).json({ status: true, data: departments });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { name, code } = req.body;
      if (!name || !code) {
        return res.status(400).json({ status: false, message: "กรุณาระบุชื่อหน่วยงานและรหัส" });
      }

      const existing = await ExternalDepartment.findOne({ where: { code: code.trim().toUpperCase() } });
      if (existing) {
        return res.status(400).json({ status: false, message: "รหัสหน่วยงานนี้มีอยู่แล้ว" });
      }

      const dept = await ExternalDepartment.create({
        name: name.trim(),
        code: code.trim().toUpperCase(),
      });

      return res.status(201).json({ status: true, message: "สร้างหน่วยงานสำเร็จ", data: dept });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, code } = req.body;

      const dept = await ExternalDepartment.findByPk(id);
      if (!dept) {
        return res.status(404).json({ status: false, message: "ไม่พบหน่วยงาน" });
      }

      if (code) {
        const existing = await ExternalDepartment.findOne({
          where: { code: code.trim().toUpperCase() },
        });
        if (existing && existing.id !== dept.id) {
          return res.status(400).json({ status: false, message: "รหัสหน่วยงานนี้มีอยู่แล้ว" });
        }
      }

      await dept.update({
        name: name ? name.trim() : dept.name,
        code: code ? code.trim().toUpperCase() : dept.code,
      });

      return res.status(200).json({ status: true, message: "อัพเดตหน่วยงานสำเร็จ", data: dept });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const dept = await ExternalDepartment.findByPk(id);
      if (!dept) {
        return res.status(404).json({ status: false, message: "ไม่พบหน่วยงาน" });
      }

      await dept.destroy();
      return res.status(200).json({ status: true, message: "ลบหน่วยงานสำเร็จ" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
};
