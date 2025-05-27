const { getNamedAccounts, deployments, network } = require("hardhat");
const {developmentChains} = require("../helper-hardhat-config");



module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    const DECIMALS = 8;
    const INITIAL_ANSWER = 200000000000;

    if(developmentChains.includes(network.name)) {
        log(" deploying mock ........");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })

        log(" mock deployed ...");
        log("--------------------------------------")

    }

}

module.exports.tags = ["all", "mocks"];