const assert = require("assert");
const api = require("../src/api");
let app = {};

const TOKEN = "VALID_TOKEN";

const headers = {
  authorization: TOKEN
};

const MOCK_HERO_CREATE = {
  name: "Homem de Ferro",
  power: "Tecnologia"
};

const MOCK_HERO_INITIAL = {
  name: "Chapolin Colorado",
  power: "Marreta Bionica"
};

let MOCK_ID = "";

describe("Test API Heroes", function() {
  this.beforeAll(async () => {
    app = await api;

    const result = await app.inject({
      method: "POST",
      headers,
      url: "/heroes",
      payload: JSON.stringify(MOCK_HERO_INITIAL)
    });

    const data = JSON.parse(result.payload);
    MOCK_ID = data.id;
  });

  it("List Heroes /heroes", async () => {
    const result = await app.inject({
      method: "GET",
      headers,
      url: "/heroes"
    });

    const data = JSON.parse(result.payload);

    assert.deepEqual(result.statusCode, 200);
    assert.ok(Array.isArray(data));
  });

  it("List Heroes - should return only 10 records", async () => {
    const result = await app.inject({
      method: "GET",
      headers,
      url: "/heroes?skip=0&limit=10"
    });

    const data = JSON.parse(result.payload);

    assert.deepEqual(result.statusCode, 200);
    assert.ok(data.length <= 10);
  });

  it("List Heroes - should filter a hero", async () => {
    const { name } = MOCK_HERO_INITIAL;

    const result = await app.inject({
      method: "GET",
      headers,
      url: `/heroes?name=${name}`
    });

    const data = JSON.parse(result.payload);

    assert.deepEqual(result.statusCode, 200);
    assert.deepEqual(name, data[0].name);
  });

  it("Create Hero - POST /heroes", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      headers,
      payload: JSON.stringify(MOCK_HERO_CREATE)
    });

    const statusCode = result.statusCode;
    const { message, id } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.notStrictEqual(id, undefined);
    assert.deepEqual("successfully created hero", message);
  });

  it("Should not create hero - power required", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      headers,
      payload: JSON.stringify(MOCK_HERO_CREATE.name)
    });

    const statusCode = result.statusCode;

    assert.ok(statusCode === 400);
  });

  it("Update Hero - PATCH /heroes/:id ", async () => {
    const id = MOCK_ID;

    const expected = {
      power: "Pílula encolhedora"
    };

    const result = await app.inject({
      method: "PATCH",
      headers,
      url: `/heroes/${id}`,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const { message } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual("successfully updated hero", message);
  });

  it("Should not updated hero - id incorrect", async () => {
    const incorrectId = "5d7e9e80d51c422deb993a67";
    const expected = {
      power: "Pílula encolhedora"
    };

    const result = await app.inject({
      method: "PATCH",
      headers,
      url: `/heroes/${incorrectId}`,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const { message } = JSON.parse(result.payload);

    assert.ok(statusCode === 412);
    assert.deepEqual("id not found", message);
  });

  it("Delete hero  - DELETE /heroes", async () => {
    const id = MOCK_ID;

    const result = await app.inject({
      method: "DELETE",
      headers,
      url: `/heroes/${id}`
    });

    const statusCode = result.statusCode;
    const { message } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(message, "Successfully deleted hero");
  });

  it("Should not deleted hero - id incorrect", async () => {
    const id = "5d7e9e80d51c422deb993a67";

    const result = await app.inject({
      method: "DELETE",
      headers,
      url: `/heroes/${id}`
    });

    const statusCode = result.statusCode;
    const { message } = JSON.parse(result.payload);

    assert.ok(statusCode === 412);
    assert.deepEqual(message, "id not found");
  });
});
