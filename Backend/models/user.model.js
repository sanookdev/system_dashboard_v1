module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      username: { type: DataTypes.STRING, unique: true, primaryKey: true },
      fname: { type: DataTypes.STRING },
      lname: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      role: { type: DataTypes.ENUM("superadmin", "staff"), allowNull: false },
    },
    {
      tableName: "users",
      timestamps: false,
      id: false,
    }
  );
};
