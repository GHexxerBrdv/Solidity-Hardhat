const { network } = require("hardhat");
import { networkConfig } from "../helper-hardhat-config";

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    

    const chainId = network.config.chainId;

    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    

    const fundMe = await deploy("FundMe", {
        from: deployer,
        rgs: [],
        log: true,

    })
}