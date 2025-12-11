const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/superadmin/category.controller");
const { check, validationResult } = require("express-validator");
const {
  verifyToken,
  isInRole,
  setUser,
  verifyApplicationKey,
  refreshToken,
} = require("../../middleware/security.js");
router.get("/", (req, res) => {
  res.status(200).json("This is superadmin.category-routes");
});

router.get("/list", verifyApplicationKey, verifyToken, async (req, res) => {
  try {
    const result = await categoryController.findAll();
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
  [check("name").notEmpty().withMessage("Name is reqruired !")],
  async (req, res) => {
    try {
      const checkErr = validationResult(req);
      if (!checkErr.isEmpty()) {
        return res.status(400).json({ status: false, error: checkErr.errors });
      }
      req.body.created_by = req.user.username;
      const result = await categoryController.create(req.body);
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

router.put("/:id", verifyApplicationKey, verifyToken, async (req, res) => {
  try {
    // return res.json(req.body)
    req.body.updated_by = req.user.username;
    req.body.updated_at = new Date();
    console.log(req.body.updated_at + 7);
    const result = await categoryController.update(req.params.id, req.body);
    return res.status(result.status ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: error.message,
    });
  }
});

router.delete("/:id", verifyApplicationKey, verifyToken, async (req, res) => {
  try {
    const result = await categoryController.remove(req.params.id);
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
