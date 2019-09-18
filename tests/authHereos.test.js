const assert = require("assert");
const api = require("../src/api");

const USER = { username: "test", password: "123" };
let app = {};

describe("Test Login route", function() {
  this.beforeAll(async () => {
    app = await api;
  });

  it("Create user", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/create",
      payload: JSON.stringify(USER)
    });

    const { message } = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.ok(statusCode === 200);
    assert.deepEqual(message, "successfully created user");
  });

  it("should return a token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER
    });

    const statusCode = result.statusCode;
    const { token } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.ok(token.length > 10);
  });
});
