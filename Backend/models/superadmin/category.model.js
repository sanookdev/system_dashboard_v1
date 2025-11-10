module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Category",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, unique: true },
      created_at: { type: DataTypes.DATE, allowNull: true },
      created_by: { type: DataTypes.STRING },
      updated_at: { type: DataTypes.DATE, allowNull: true },
      updated_by: { type: DataTypes.STRING },
      public: { type: DataTypes.INTEGER }
    },
    {
      tableName: "system_categories",
      timestamps: false,
    }
  );
};
