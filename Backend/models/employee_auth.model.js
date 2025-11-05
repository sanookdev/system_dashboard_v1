module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      username: { type: DataTypes.STRING, unique: true, primaryKey: true },
      password: { type: DataTypes.STRING },
      fname: { type: DataTypes.STRING },
      lname: { type: DataTypes.STRING },
    },
    {
      tableName: "user",
      timestamps: false,
      id: false,
    }
  );
};
