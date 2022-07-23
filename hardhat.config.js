// require("@nomiclabs/hardhat-waffle")
// require("hardhat-gas-reporter")
// require("@nomiclabs/hardhat-etherscan")
// require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
require("solidity-coverage")
require("hardhat-deploy")

module.exports = {
    // defaultNetwork: "hardhat",
    // networks: {
    //     hardhat: {
    //         chainId: 31337,
    //         // gasPrice: 130000000000,
    //     },
    //     // kovan: {
    //     //     url: KOVAN_RPC_URL,
    //     //     accounts: [PRIVATE_KEY],
    //     //     chainId: 42,
    //     //     blockConfirmations: 6,
    //     //     gas: 6000000,
    //     // },
    //     // rinkeby: {
    //     //     url: RINKEBY_RPC_URL,
    //     //     accounts: [PRIVATE_KEY],
    //     //     chainId: 4,
    //     //     blockConfirmations: 6,
    //     // },
    // },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    // etherscan: {
    //     apiKey: ETHERSCAN_API_KEY,
    // },
    // gasReporter: {
    //     enabled: false,
    //     currency: "USD",
    //     outputFile: "gas-report.txt",
    //     noColors: true,
    //     // coinmarketcap: COINMARKETCAP_API_KEY,
    // },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
    },
}
