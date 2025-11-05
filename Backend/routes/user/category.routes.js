const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/user/category.controller");
const { check, validationResult } = require("express-validator");
const {
  verifyToken,
  isInRole,
  setUser,
  verifyApplicationKey,
  refreshToken,
} = require("../../middleware/security.js");
router.get("/", (req, res) => {
  res.status(200).json("This is user.category-routes");
});

router.get("/list", verifyApplicationKey, verifyToken, async (req, res) => {
  try {
    // return res.json(req.user)
    const result = await categoryController.findAllByEmployee(req.user.username);
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
