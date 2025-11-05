const express = require("express");
const router = express.Router();
const permissionController = require("../../controllers/superadmin/permission.controller");
const { check, validationResult, param } = require("express-validator");
const {
  verifyToken,
  verifyApplicationKey,
} = require("../../middleware/security.js");

router.get("/list", async (req, res) => {
  try {
    const result = await permissionController.findAll();
    res.status(result.status ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: error.message,
    });
  }
});

router.post(
  "/",
  [
    check("employee_code").notEmpty().withMessage("โปรดระบุรหัสผู้ใช้งาน"),
    check("system_id").notEmpty().withMessage("โปรดระบุ system_id!"),
    check("isAdmin").notEmpty().withMessage("โปรดระบุสถานะผู้ใช้งาน!"),
  ],
  async (req, res) => {
    try {
      const checkErr = validationResult(req);
      if (!checkErr.isEmpty()) {
        return res.status(400).json({ status: false, error: checkErr.errors });
      }
      req.body.created_by = req.user?.username || "system";
      const employee_code = req.body.employee_code;
      req.body.employee_code = employee_code.toUpperCase();
      const result = await permissionController.create(req.body);
      res.status(result.status ? 201 || result.status_code : 500).json(result);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      });
    }
  }
);
/** PUT /:employee_code  (update by employee_code) */
router.put(
  "/:employee_code",
  verifyApplicationKey,
  verifyToken,
  [
    param("employee_code").trim().notEmpty().withMessage("โปรดระบุ employee_code ในพาธ"),
    // optional fields: แต่ถ้าส่งมาก็ตรวจ
    check("system_id").optional().isNumeric().withMessage("system_id ต้องเป็นตัวเลข"),
    check("isAdmin").optional().isBoolean().withMessage("isAdmin ต้องเป็น boolean"),
  ],
  async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({ status: false, message: "ไม่มีข้อมูลที่ส่งมา (empty body)" });
      }
      const checkErr = validationResult(req);
      if (!checkErr.isEmpty()) {
        return res.status(400).json({ status: false, error: checkErr.array() });
      }

      const employee_code = String(req.params.employee_code || "").trim().toUpperCase();
      // return res.json(req.body)
      const { isAdmin, system_id } = req.body;
      req.updated_by = req.user?.username || "system";

      const result = await permissionController.updateByEmployeeCode(employee_code, isAdmin, system_id, req.user?.username || "system");
      // ถ้าสำเร็จให้ 200, ถ้าไม่พบให้ 404 (ให้ controller ใส่ status=false + status_code=404 ก็ได้)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ : permission route",
        error: error.message,
      });
    }
  }
);
module.exports = router;
