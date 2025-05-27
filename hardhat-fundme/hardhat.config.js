require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/hardhat-chainlink");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: '0.8.28' }, { version: '0.8.0' }],
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    user: {
      default: 1
    }
  }
};
