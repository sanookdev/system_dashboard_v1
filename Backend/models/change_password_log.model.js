module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ChangePasswordLog",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING },
      newPassword: { type: DataTypes.STRING },
      changeDate: { type: DataTypes.DATE },
      changeBy: { type: DataTypes.STRING },
    },
    {
      tableName: "changePasswordLog",
      timestamps: false,
    }
  );
};
