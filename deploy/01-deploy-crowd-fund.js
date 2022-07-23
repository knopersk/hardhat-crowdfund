module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    let ethUsdPriceFeedAddress
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address

    const crowdFund = await deploy("CrowdFund", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    })
    log("CrowdFund deployed!")
    log("------------------------------------------------")
}

module.exports.tags = ["all", "crowdfund"]
