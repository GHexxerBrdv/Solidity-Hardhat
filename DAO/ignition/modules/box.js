
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const BoxModule = buildModule("BoxModule", (m) => {
  
  const box = m.contract("Box", []);

  return { box };
});

module.exports = {BoxModule};
