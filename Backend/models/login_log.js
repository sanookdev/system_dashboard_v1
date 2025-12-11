// login_log.model.js
module.exports = (sequelize, DataTypes) => {
    const LoginLog = sequelize.define(
        "LoginLog",
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // กำหนดให้ username ห้ามซ้ำ เพื่อให้ค้นหาง่าย
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW, // เวลาสร้างครั้งแรก
            },
            lastlogin_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW, // เวลาล็อกอินล่าสุด
            },
        },
        {
            tableName: "login_logs",
            timestamps: false, // ปิด default timestamps ของ sequelize เพราะเราสร้าง field เองแล้ว
        }
    );
    return LoginLog;
};