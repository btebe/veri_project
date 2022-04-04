module.exports = (sequelize, DataTypes) => {
  const Tokens = sequelize.define("Tokens", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Tokens;
};
