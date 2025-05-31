require("dotenv").config();

const networkConfig = {
    hardhat: {
        vrfCoordinatorMock: "",
        entranceFee: "10000000000000000",
        gasLane: "0x0000000000000000000000000000000000000000000000000000000000000000",
        subscriptionId: "1",
        callbackGasLimit: "500000",
        interval: "3",
    },
    localhost: {
        vrfCoordinatorMock: "",
        entranceFee: "10000000000000000",
        gasLane: "0x0000000000000000000000000000000000000000000000000000000000000000",
        subscriptionId: "1",
        callbackGasLimit: "500000",
        interval: "3",
    },

    sepolia: {
        vrfCoordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        entranceFee: "10000000000000000",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: process.env.SUBID,
        callbackGasLimit: "2500000",
        interval: "30",
    }
}

const developmentChains = ["hardhat", "localhost"];

module.exports = {networkConfig, developmentChains};