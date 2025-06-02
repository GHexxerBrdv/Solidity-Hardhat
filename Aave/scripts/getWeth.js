const { getNamedAccounts, ethers } = require("hardhat")

async function getWeth() {
    const {deployer} = await getNamedAccounts();
    const signer = await ethers.provider.getSigner(deployer);
    // const signer =await ethers.provider.getSigner();
    // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    // https://eth-mainnet.g.alchemy.com/v2/qMz6H7xPx-34t6a1V8bZJIVBvlHoFYqc
    const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", signer);

    const tx = await iWeth.deposit({value: "100000000000000000"})
    await tx.wait(1);
    const wethBalance = await iWeth.balanceOf(deployer);

    console.log(`Got ${wethBalance.toString()} WETH`);
}   

module.exports = {getWeth}