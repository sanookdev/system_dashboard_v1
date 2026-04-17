const express = require("express");
const router = express.Router();
const externalUserController = require("../../controllers/superadmin/external_user.controller");
const { verifyToken, verifyApplicationKey } = require("../../middleware/security.js");

router.get("/", verifyApplicationKey, verifyToken, externalUserController.findAll);
router.post("/", verifyApplicationKey, verifyToken, externalUserController.create);
router.put("/:username", verifyApplicationKey, verifyToken, externalUserController.update);
router.delete("/:username", verifyApplicationKey, verifyToken, externalUserController.remove);
router.post("/:username/reset-password", verifyApplicationKey, verifyToken, externalUserController.resetPassword);

module.exports = router;
