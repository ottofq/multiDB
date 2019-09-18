const Sequelize = require("sequelize");

const userSchema = {
  name: "users",
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      required: true
    },
    password: {
      type: Sequelize.STRING,
      required: true
    }
  },
  options: {
    tableName: "TB_USERS",
    freezeTableName: false,
    timestamps: true
  }
};

module.exports = userSchema;
