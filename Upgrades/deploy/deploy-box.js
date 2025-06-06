const { network } = require("hardhat");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        proxy: {
            proxyContract: "OpenzeppelinTransparentProxy",
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin"
            }
        },
    }) 
}