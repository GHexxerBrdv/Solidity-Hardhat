// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { VRFMockModule } = require("./vrfCoordinatorV2Mock");
const { networkConfig, developmentChains } = require("../../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = buildModule("raffleModule", (m) => {
  const isLocal = developmentChains.includes(network.name);
  const config = networkConfig[network.name];

  let vrfCoordinatorAddress;
  let subscriptionId;
  
  const entranceFee = m.getParameter("entranceFee", config.entranceFee);
  const gasLane = m.getParameter("gasLane", config.gasLane);
  const callbackGasLimit = m.getParameter("callbackGasLimit", config.callbackGasLimit);
  const interval = m.getParameter("interval", config.interval);

  if (isLocal) {
    const { vrfCoordinatorMock } = m.useModule(VRFMockModule);
    vrfCoordinatorAddress = vrfCoordinatorMock;
    subscriptionId = m.getParameter("subscriptionId", "1");
    const raffle = m.contract("Raffle", [
      vrfCoordinatorAddress,
      entranceFee,
      gasLane,
      subscriptionId,
      callbackGasLimit,
      interval
    ]);

    return { raffle, vrfCoordinatorMock };

  } else {
    vrfCoordinatorAddress = m.getParameter("vrfCoordinator", config.vrfCoordinator);
    subscriptionId = m.getParameter("subscriptionId", config.subscriptionId);
    const raffle = m.contract("Raffle", [
      vrfCoordinatorAddress,
      entranceFee,
      gasLane,
      subscriptionId,
      callbackGasLimit,
      interval
    ]);

    return { raffle };
  }


})
