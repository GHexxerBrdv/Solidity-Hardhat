require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || ""
const PRIVATE_KEY =
    process.env.PRIVATE_KEY || "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a"


module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
            gasPrice: 50_000_000_000,
        },
        localhost: {
            chainId: 31337,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.28",
            },
            {
                version: "0.6.12",
            },
            {
                version: "0.4.19",
            },
        ],
    },
    // gasReporter: {
    //     enabled: true,
    //     currency: "USD",
    //     outputFile: "gas-report.txt",
    //     noColors: true,
    //     // coinmarketcap: COINMARKETCAP_API_KEY,
    // },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}