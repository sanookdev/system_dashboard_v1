module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "CategoryPermission",
    {
      employee_code: DataTypes.STRING,
      category_id: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_at: DataTypes.DATE,
      updated_by: DataTypes.STRING,
    },
    {
      tableName: "category_permissions",
      timestamps: false,
    }
  );
};
