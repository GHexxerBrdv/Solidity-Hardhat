const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");

const VRFMockModule = buildModule("VRFMockModule", (m) => {
    const baseFeeAmount = ethers.utils.parseEther("0.25").toString();
    const baseFee = m.getParameter("baseFee", baseFeeAmount);
    const gasPriceLink = m.getParameter("gasPriceLink", "1000000000");

    const vrfCoordinatorMock = m.contract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink]);

    const subIdCall = m.call(vrfCoordinatorMock, "createSubscription", []);

    return {vrfCoordinatorMock, subscriptionId: subIdCall};
})

module.exports = {VRFMockModule}