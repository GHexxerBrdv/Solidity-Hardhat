const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");

  console.log(" Deploying contract ..... ");

  const simpleStorage = await SimpleStorage.deploy();
  console.log(" Deployed contract is: ", simpleStorage.target);

  // console.log(network.config);

  // if(network.config.chainId === 4) {
  //   await simpleStorage.deploymentTransaction.wait(3);
    
  //   await verify(simpleStorage.target, []);
  // }

  const currentValue = await simpleStorage.retrieve();
  console.log(`the current value is: ${currentValue}`);

  const transactionRespoce = await simpleStorage.store("7");
  await transactionRespoce.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`the updated value is: ${updatedValue}`);

}

async function verify(contractAddress, args) {
  console.log(" Varifying contract ...")

  try {
    await run("varify:varify", {
      address: contractAddress,
      constructorArguments: args
    });
  } catch (e) {
    console.log(e);
  }


}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});