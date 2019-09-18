const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  power: {
    type: String,
    required: true
  },
  insertAt: {
    type: Date,
    default: new Date()
  }
});
module.exports = mongoose.model("heroes", heroSchema);
