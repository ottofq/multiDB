const ICrud = require("../interfaces/interfaceCrud");
const mongoose = require("mongoose");
const connectionState = {
  0: "Disconneted",
  1: "Connected",
  2: "Connecting",
  3: "Disconneting",
  4: "Invalid Credentials"
};

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  static async connect() {
    await mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true
      },

      function(error) {
        if (!error) return;
        console.log("Error connection!");
      }
    );
    const connection = mongoose.connection;
    connection.once("open", () => console.log("Running Database!"));
    return connection;
  }

  isConnected() {
    const state = connectionState[this._connection.readyState];
    try {
      if (state === "Connected") return true;
    } catch (error) {
      console.log("Error", error);
      return false;
    }
  }

  create(item) {
    return this._schema.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._schema
      .find(item)
      .skip(skip)
      .limit(limit);
  }
  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }
  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
