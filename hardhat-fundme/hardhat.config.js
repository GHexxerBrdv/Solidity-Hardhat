require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/hardhat-chainlink");
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: '0.8.28' }, { version: '0.6.6' }],
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};
