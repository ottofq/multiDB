const assert = require("assert");
const Postgres = require("../src/db/strategies/postgres/postgres");
const Context = require("../src/db/strategies/base/interfaceStrategy");
const heroesSchema = require("../src/db/strategies/postgres/schemas/heroesSchema");

const MOCK_HERO_CREATE = {
  name: "Homem Aranha",
  power: "Teia"
};

const MOCK_HERO_UPDATE = {
  name: "Batman",
  power: "Dinheiro"
};

let contextPostgres;

describe("Postgres Strategy", function() {
  this.timeout(Infinity);
  this.beforeAll(async function() {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, heroesSchema);
    contextPostgres = new Context(new Postgres(connection, model));
  });

  it("PostgresSQL Connection", async function() {
    const result = await contextPostgres.isConnected();
    assert.equal(result, true);
  });

  it("Create Hero", async function() {
    const result = await contextPostgres.create(MOCK_HERO_CREATE);
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });

  it("List Hero", async function() {
    const [result] = await contextPostgres.read({
      name: MOCK_HERO_CREATE.name
    });
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });

  it("Update Hero", async function() {
    await contextPostgres.create(MOCK_HERO_UPDATE);

    const [itemUpdate] = await contextPostgres.read({
      name: MOCK_HERO_UPDATE.name
    });

    const newItem = {
      ...MOCK_HERO_UPDATE,
      name: "Mulher Maravilha"
    };
    const [result] = await contextPostgres.update(itemUpdate.id, newItem);
    const [itemUpdated] = await contextPostgres.read({ id: itemUpdate.id });

    assert.deepEqual(result, 1);
    assert.deepEqual(itemUpdated.name, newItem.name);
  });

  it("Delete Hero", async function() {
    const [item] = await contextPostgres.read({ name: "Mulher Maravilha" });
    const result = await contextPostgres.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
