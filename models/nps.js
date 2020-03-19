module.exports = (sequelize, DataTypes) => {
  const NPS = sequelize.define("nps", {
    nationalPark: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  let User = sequelize.import("./users");
  NPS.belongsTo(User, { foreignKey: "userId" });
  User.hasMany(NPS);

  return NPS;
};
