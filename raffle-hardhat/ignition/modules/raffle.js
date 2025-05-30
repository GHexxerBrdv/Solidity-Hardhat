// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const {VRFMockModule} = require("./vrfCoordinatorV2Mock");

module.exports = buildModule("raffleModule", (m) => {
  const {vrfCoordinatorMock} = m.useModule(VRFMockModule);



  const entranceFee = m.getParameter("entranceFee", "10000000000000000");
  const gasLane = m.getParameter("gasLane", "0x0000000000000000000000000000000000000000000000000000000000000000");
  const subscriptionId = m.getParameter("subscriptionId", "1");
  const callbackGasLimit = m.getParameter("callbackGasLimit", "500000");
  const interval = m.getParameter("interval", "3");
  const raffle = m.contract("Raffle", [
    vrfCoordinatorMock,
    entranceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    interval
  ]);

  return {raffle, vrfCoordinatorMock};
})
