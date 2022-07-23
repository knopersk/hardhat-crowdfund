const DECIMALS = "8"
const INITIAL_PRICE = "150000000000" // 1500
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("MockV3Aggregator", {
        contract: "MockV3Aggregator",
        from: deployer,
        log: true,
        args: [DECIMALS, INITIAL_PRICE],
    })
    log("Mocks deployed!")
    log("------------------------------------------------")
}
module.exports.tags = ["all", "mocks"]
