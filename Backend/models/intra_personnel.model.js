module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "AppmPersonnel",
    {
      USERNAME: { type: DataTypes.STRING, primaryKey: true },
      ID_CODE: { type: DataTypes.STRING },
      BIRTH_DATE: { type: DataTypes.STRING },
    },
    {
      tableName: "appm_personnel",
      timestamps: false,
      id: false,
    }
  );
};
