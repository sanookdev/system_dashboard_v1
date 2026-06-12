const express = require("express");
const router = express.Router();
const controller = require("../../controllers/superadmin/external_department.controller");
const { verifyToken, verifyApplicationKey } = require("../../middleware/security.js");

router.get("/", verifyApplicationKey, verifyToken, controller.findAll);
router.post("/", verifyApplicationKey, verifyToken, controller.create);
router.put("/:id", verifyApplicationKey, verifyToken, controller.update);
router.delete("/:id", verifyApplicationKey, verifyToken, controller.remove);

module.exports = router;
