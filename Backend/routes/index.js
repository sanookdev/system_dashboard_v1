const express = require("express");
const router = express.Router();

router.use("/superadmin/category", require("./superadmin/category.routes"));
router.use("/superadmin/permission", require("./superadmin/permission.routes"));
router.use("/superadmin/systems", require("./superadmin/systems.routes"));
router.use("/user/category", require("./user/category.routes"));
router.use("/auth", require("./auth.routes"));
router.get("/", (req, res) => {
  res.end("This is index routes.");
});
module.exports = router;
