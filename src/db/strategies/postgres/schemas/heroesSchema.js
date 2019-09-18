const Sequelize = require("sequelize");

const heroesSchema = {
  name: "heroes",
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      required: true
    },
    power: {
      type: Sequelize.STRING,
      required: true
    }
  },
  options: {
    tableName: "TB_HEROES",
    freezeTableName: false,
    timestamps: false
  }
};

module.exports = heroesSchema;
