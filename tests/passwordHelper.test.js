const assert = require("assert");
const PasswordHelper = require("../src/helpers/passwordHelper");

const PASS = "PASS@WORD@SECR3T";
const HASH = "$2b$10$Iy5HSODl9z40yCOxPgv47uqf5LZIS3JfeDcSbcSxBZVqZIrDkwDrW";

describe("UserHelper test suite", function() {
  it("should generate password hash ", async () => {
    const result = await PasswordHelper.hashPassword(PASS);
    assert.ok(result.length > 10);
  });

  it("should compare hash with password", async () => {
    const result = await PasswordHelper.comparePassword(PASS, HASH);

    assert.ok(result);
  });
});
