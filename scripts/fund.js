const { ethers, getNamedAccounts, waffle } = require("hardhat")

async function main() {
    const sendValue = ethers.utils.parseEther("0.1")
    const { deployer } = await getNamedAccounts()
    const crowdFund = await ethers.getContract("CrowdFund", deployer)
    console.log(`Got contract CrowdFund at ${crowdFund.address}`)
    console.log("Funding contract...")
    const transactionResponse = await crowdFund.fund({
        value: sendValue,
    })
    await transactionResponse.wait(1)

    const fundedInEth = sendValue / 10 ** 18
    console.log(`Funded ${fundedInEth} ETH`)

    const balance = await crowdFund.provider.getBalance(crowdFund.address)
    const balanceInEth = balance / 10 ** 18
    console.log(`Current contract balance is ${balanceInEth} ETH`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
