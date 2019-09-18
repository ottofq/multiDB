const assert = require("assert");
const MongoDB = require("../src/db/strategies/mongodb/mongodb");
const HeroSchema = require("../src/db/strategies/mongodb/schemas/heroesSchema");
const Context = require("../src/db/strategies/base/interfaceStrategy");

const MOCK_HERO_CREATE = {
  name: "Homem Aranha",
  power: "Teia"
};

const MOCK_HERO_UPDATE = {
  name: "Capitão America",
  power: "Escudo"
};

let contextMongoDB = {};

describe("MongoDB Strategy", function() {
  this.beforeAll(async function() {
    const connection = await MongoDB.connect();
    contextMongoDB = new Context(new MongoDB(connection, HeroSchema));
  });

  it("MongoDB connection", async function() {
    const result = contextMongoDB.isConnected();
    assert.equal(result, true);
  });

  it("Create Hero", async function() {
    const { name, power } = await contextMongoDB.create(MOCK_HERO_CREATE);
    assert.deepEqual({ name, power }, MOCK_HERO_CREATE);
  });

  it("List Heroes", async function() {
    const [{ name, power }] = await contextMongoDB.read({
      name: MOCK_HERO_CREATE.name
    });
    assert.deepEqual({ name, power }, MOCK_HERO_CREATE);
  });

  it("Update hero", async function() {
    const { id } = await contextMongoDB.create(MOCK_HERO_UPDATE);
    const result = await contextMongoDB.update(id, { name: "Thor" });

    assert.deepEqual(result.nModified, 1);
  });

  it("Delete hero", async function() {
    const [hero] = await contextMongoDB.read({ name: "Thor" });
    const result = await contextMongoDB.delete(hero._id);

    assert.deepEqual(result.n, 1);
  });
});
