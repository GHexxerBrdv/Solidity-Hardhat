const { getNamedAccounts, ethers } = require("hardhat");
const { networkConfig } = require("../helper.config")



async function getWeth() {
    const {deployer} = await getNamedAccounts();

    // const iWeth = await ethers.getContractAt("IWeth", networkConfig[network.config.chainId].wethToken, deployer);
    const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer);

    const tx = await iWeth.deposit({value: '100000000000000000'});

    await tx.wait(1);
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = {getWeth}