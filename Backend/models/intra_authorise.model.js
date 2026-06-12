module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Authorise",
    {
      authorise_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      authorise_idcard: { type: DataTypes.STRING },
      authorise_pass: { type: DataTypes.STRING },
      medcode: { type: DataTypes.STRING },
      grp_active_id: { type: DataTypes.INTEGER },
      member_code: { type: DataTypes.STRING },
      Type_authorise: { type: DataTypes.INTEGER },
      finger_id: { type: DataTypes.INTEGER },
      ID_CODE_OUT: { type: DataTypes.STRING },
    },
    {
      tableName: "authorise",
      schema: "menu_handle",
      timestamps: false,
    }
  );
};
