const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const crowdFund = await ethers.getContract("CrowdFund", deployer)
    console.log("Withdrawing...")
    const transactionResponse = await crowdFund.withdraw()
    await transactionResponse.wait(1)
    console.log("DONE!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
