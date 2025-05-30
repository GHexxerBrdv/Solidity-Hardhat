const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("OkModule", (m) => {
    const Ok = m.contract("Ok");

    return {Ok};
})