const {ethers} = require("hardhat");
const {expect, assert} = require("chai");

describe("SimpleStorage", () => {
  let SimpleStorage;
  let simpleStorage;
  beforeEach(async function () {
    SimpleStorage = await ethers.getContractFactory("SimpleStorage");

    simpleStorage = await SimpleStorage.deploy();

  })

  it("Should start with a favorite number 0", async function() {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";

    assert.equal(currentValue.toString(), expectedValue);

  })

  it("should update when we call store", async function() {
    await simpleStorage.store("3");
    const updatedValue = await simpleStorage.retrieve();

    assert.equal(updatedValue, "3");
  })
})