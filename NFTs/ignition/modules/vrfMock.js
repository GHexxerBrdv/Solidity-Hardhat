const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const VrfMockModule  = buildModule("VrfMockModule", (m) => {
    const baseFee = m.getParameter("baseFee", "1000000000000000000");
    const gasPriceLink = m.getParameter("gasPriceLink", "1000000000");
    
    const vrfMock = m.contract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink]);

    return { vrfMock };
});

module.exports = {VrfMockModule}