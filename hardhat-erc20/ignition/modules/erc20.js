const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("ManualTokenModule", (m) => {
  const suply = m.getParameter("initialSupply", "2000");
  const name = m.getParameter("tokenName", "GToken");
  const symbol = m.getParameter("tokenSymbol", "HXT");

  const token = m.contract("TokenERC20", [suply, name, symbol]);

  const Name = m.call(token, "name");
  console.log("Token name is :", Name.value.toString());

  return { token };
});
