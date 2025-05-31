require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/hardhat-chainlink");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/EsPqkWPBgXd_BWDyp5RpujEMWugx05m7",
      accounts: [`0x${process.env.PRIV}`],
      chainId: 11155111,
    }
  },
  mocha: {
    timeout: 200000,
  }
};


