const express = require("express");
const router = express.Router();
const systemController = require("../../controllers/superadmin/systems.controller");
const { check, validationResult } = require("express-validator");
const {
  verifyToken,
  isInRole,
  verifyApplicationKey,
} = require("../../middleware/security.js");

router.get("/", (req, res) => {
  res.status(200).json("This is superadmin.systems-routes");
});
router.get("/list", async (req, res) => {
  try {
    const result = await systemController.findAll();
    return res.status(result.status ? 200 : 500).json(result);
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
  verifyApplicationKey,
  verifyToken,
  [
    check("name").notEmpty().withMessage("โปรดกรอกชื่อระบบ!"),
    check("description").notEmpty().withMessage("โปรดกรอกข้อมูลคำอธิบายระบบ!"),
    check("icon").notEmpty().withMessage("โปรดเลือก Icon สำหรับระบบ"),
    check("category_id").notEmpty().withMessage("โปรดเลือกหมวดหมู่"),
    check("owner_department")
      .notEmpty()
      .withMessage("โปรดกรอกข้อมูลหน่วยงานผู้รับผิดชอบระบบ"),
  ],
  async (req, res) => {
    try {
      const checkErr = validationResult(req);
      if (!checkErr.isEmpty()) {
        return res.status(400).json({ status: false, error: checkErr.errors });
      }

      req.body.created_by = req.user.username;

      const result = await systemController.create(req.body);
      return res.status(result.status ? 201 : 500).json(result);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      });
    }
  }
);
router.put(
  "/:id",
  verifyApplicationKey,
  verifyToken,
  isInRole(["admin", "superadmin"]),
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("icon").notEmpty().withMessage("Icon is required"),
    check("category_id").notEmpty().withMessage("Category ID is required"),
    check("owner_department")
      .notEmpty()
      .withMessage("Owner Department is required"),
  ],
  async (req, res) => {
    try {
      const checkErr = validationResult(req);
      if (!checkErr.isEmpty()) {
        return res.status(400).json({ status: false, error: checkErr.errors });
      }

      const id = req.params.id;

      // เพิ่มข้อมูลสำหรับ update
      req.body.updated_at = new Date();
      req.body.updated_by = req.user.username;

      const result = await systemController.update(id, req.body);
      return res.status(result.status ? 200 : 500).json(result);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      });
    }
  }
);
router.delete("/:id", verifyApplicationKey, verifyToken, async (req, res) => {
  try {
    const result = await systemController.remove(req.params.id);
    return res.status(result.status ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: error.message,
    });
  }
});


module.exports = router;
