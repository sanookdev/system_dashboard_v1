module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ExternalUser",
    {
      username: { type: DataTypes.STRING, unique: true, primaryKey: true },
      password: { type: DataTypes.STRING, allowNull: false },
      fname: { type: DataTypes.STRING },
      lname: { type: DataTypes.STRING },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: "external_users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      id: false,
    }
  );
};
