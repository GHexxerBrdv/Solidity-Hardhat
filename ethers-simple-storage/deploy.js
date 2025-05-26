const ethers = require("ethers");
const { readFileSync } = require("fs");
const fs = require("fs-extra");

async function main() {
    const provider = new ethers.provider.JsonRpcProvider("http://0.0.0.0:8545");
    const wallet = new ethers.Wallet("private key", provider);
    const abi = readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    const contract = await contractFactory.deploy();

    const contractRecipt = await contractFactory.deployTransaxtion.wait(1);
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1)
})