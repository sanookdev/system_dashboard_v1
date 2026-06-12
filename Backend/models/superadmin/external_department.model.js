module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ExternalDepartment",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    },
    {
      tableName: "external_departments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
