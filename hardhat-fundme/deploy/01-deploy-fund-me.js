const { getNamedAccounts, deployments, network } = require("hardhat");
const {networkConfig, developmentChains} = require("../helper-hardhat-config");


module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    const chianId = network.config.chainId;

    let ethUsdPriceFeedAddress;

    if(developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;

    } else {
        ethUsdPriceFeedAddress = networkConfig[chianId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true
    });

}

module.exports.tags = ["all", "fundMe"]