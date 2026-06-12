const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();


const commonOptions = {
  dialect: "mysql",
  timezone: "+07:00",            // ✅ ใช้ที่นี่พอ
  dialectOptions: {
    timezone: "+07:00",
    dateStrings: true,           // ✅ อ่าน DATETIME เป็นสตริงตามโซน
    typeCast: true,
  },
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  },
  // logging: false,
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host: process.env.DB_HOST, port: process.env.DB_PORT || 3306, ...commonOptions }

);
const userDB = new Sequelize(
  process.env.AUTH_DB_NAME,
  process.env.AUTH_DB_USER,
  process.env.AUTH_DB_PASS,
  { host: process.env.AUTH_DB_HOST, ...commonOptions }
);

const intraDB = new Sequelize(
  process.env.INTRA_DB_NAME,
  process.env.INTRA_DB_USER,
  process.env.INTRA_DB_PASS,
  { host: process.env.INTRA_DB_HOST, port: process.env.INTRA_DB_PORT || 3306, ...commonOptions }
);

const intraMenuHandleDB = new Sequelize(
  'menu_handle',
  process.env.INTRA_DB_USER,
  process.env.INTRA_DB_PASS,
  { host: process.env.INTRA_DB_HOST, port: process.env.INTRA_DB_PORT || 3306, ...commonOptions }
);

const db = {};
db.Sequelize = Sequelize;

db.sequelize = sequelize;
db.userDB = userDB;
db.SystemPermission = require("./system_permission.model")(
  sequelize,
  DataTypes
);
db.System = require("./system.model")(sequelize, DataTypes);

db.SystemPermission.belongsTo(db.System, {
  foreignKey: "system_id",
  as: "system",
});

db.System.hasMany(db.SystemPermission, {
  foreignKey: "system_id",
  as: "systemPermissions",
});

db.User = require("./user.model")(sequelize, DataTypes);
db.ExternalUser = require("./external_user.model")(sequelize, DataTypes);
db.ExternalDepartment = require("./superadmin/external_department.model")(sequelize, DataTypes);

// ExternalDepartment <-> ExternalUser associations
db.ExternalDepartment.hasMany(db.ExternalUser, {
  foreignKey: "department_id",
  as: "users",
});
db.ExternalUser.belongsTo(db.ExternalDepartment, {
  foreignKey: "department_id",
  as: "department",
});

db.Category = require("./superadmin/category.model")(sequelize, DataTypes);

db.Category.hasMany(db.System, {
  foreignKey: "category_id",
  as: "systems",
  onDelete: "CASCADE", // ✅ เพิ่ม
  hooks: true,
});

db.System.belongsTo(db.Category, {
  foreignKey: "category_id",
  as: "category",
});

db.CategoryPermission = require("./superadmin/category_permission.model")(
  sequelize,
  DataTypes
);
db.Category.hasMany(db.CategoryPermission, {
  foreignKey: "category_id",
  as: "permissions", // 👈 alias สำหรับ include
  onDelete: "CASCADE", // ✅ ถ้าลบ category จะลบ permissions ด้วย
  hooks: true,
});
db.CategoryPermission.belongsTo(db.Category, {
  foreignKey: "category_id",
  as: "category",
});

db.LoginLog = require("./login_log")(sequelize, DataTypes);

// AUTH DB
db.employeeAuth = require("./employee_auth.model")(userDB, DataTypes);
db.ChangePasswordLog = require("./change_password_log.model")(userDB, DataTypes);
// (END) AUTH DB

// INTRA DB
db.intraDB = intraDB;
db.IntraPersonnel = require("./intra_personnel.model")(intraDB, DataTypes);
db.IntraAuthorise = require("./intra_authorise.model")(intraMenuHandleDB, DataTypes);
// (END) INTRA DB

// Auto-sync new tables & seed departments
(async () => {
  try {
    await db.ExternalDepartment.sync({ alter: true });
    await db.ExternalUser.sync({ alter: true });

    // Seed default departments if table is empty
    const count = await db.ExternalDepartment.count();
    if (count === 0) {
      await db.ExternalDepartment.bulkCreate([
        { name: "กลุ่มงานอายุรกรรม", code: "IM" },
        { name: "กลุ่มงานศัลยกรรม", code: "SU" },
        { name: "กลุ่มงานกุมารเวชกรรม", code: "PE" },
        { name: "กลุ่มงานสูติ-นรีเวชกรรม", code: "OB" },
        { name: "กลุ่มงานออร์โธ", code: "OT" },
        { name: "กลุ่มงานเวชศาสตร์ฉุกเฉิน", code: "EM" },
      ]);
      console.log("✅ Seeded default external departments");
    }
  } catch (err) {
    console.error("Auto-sync error:", err.message);
  }
})();

module.exports = db;

