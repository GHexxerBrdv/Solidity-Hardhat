const { getNamedAccounts, ethers } = require("hardhat");
const { getWeth } = require("./getWeth");

async function main() {
    await getWeth();
    const { deployer } = getNamedAccounts();
    const signer = await ethers.provider.getSigner(deployer);
    // lendingpooladdressprovider = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5

    const lendingPool = await getLendingPool(signer);
    console.log(`LendingPool address is ${lendingPool.target}`);

    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    await approveERC20(wethTokenAddress, lendingPool.target, "100000000000000000", signer);

    await lendingPool.deposit(wethTokenAddress, "100000000000000000", signer, 0);
    console.log("deposited..")

    let { availableBorrowsETH, totalDebtEth } = await getLendingPoolUserData(lendingPool, signer);

    const daiPrice = await getDaiPrice();

    const daiPriceInEth = parseFloat(ethers.formatUnits(daiPrice, 18));

   
    const availableBorrowsETHFloat = parseFloat(ethers.formatEther(availableBorrowsETH));

    
    const amountDaiToBorrow = availableBorrowsETHFloat * 0.7 / daiPriceInEth;

    const amountDaiToBorrowWei = ethers.parseEther(amountDaiToBorrow.toString());

    console.log(`You can borrow ${amountDaiToBorrow} DAI`)

    await borrowDai(
        "0x6b175474e89094c44da98b954eedeac495271d0f",
        lendingPool,
        amountDaiToBorrowWei,
        signer.address
    )

    await repay(
        amountDaiToBorrowWei,
        networkConfig[network.config.chainId].daiToken,
        lendingPool,
        deployer
    )
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, BORROW_MODE, account)
    await repayTx.wait(1)
    console.log("Repaid!")
}

async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt("ILendingPoolAddressesProvider", "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", account);
    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account);
    return lendingPool
}

async function getLendingPoolUserData(lendingPool, user) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } = await lendingPool.getUserAccountData(user);

    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH }
}

async function approveERC20(contract, spender, amount, account) {
    const erc20Token = await ethers.getContractAt("IERC20", contract, account);
    const tx = await erc20Token.approve(spender, amount);
    await tx.wait(1);
    console.log("Approved......");
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)
    return price
}

async function borrowDai(daiAddress, lendingPool, amountDaiToBorrow, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow,1, 0, account);
    await borrowTx.wait(1);
    console.log("Borrowed....");
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})