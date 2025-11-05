module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "SystemPermission",
    {
      employee_code: DataTypes.STRING,
      system_id: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING
    },
    {
      tableName: "system_permissions",
      timestamps: false,
    }
  );
};
