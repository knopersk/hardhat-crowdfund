const { assert, expect } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("CrowdFund", function () {
    let crowdFund
    let mockV3Aggregator
    let deployer
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        crowdFund = await ethers.getContract("CrowdFund", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("Constructor", async function () {
        it("Sets the aggregator addresses correctly", async function () {
            const response = await crowdFund.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("Fund", function () {
        it("Updates the amount funded", async function () {
            await crowdFund.fund({ value: sendValue })
            const response = await crowdFund.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("Adds funder to array of funders", async function () {
            await crowdFund.fund({ value: sendValue })
            const response = await crowdFund.getFunder(0)
            assert.equal(response, deployer)
        })

        it("Fails if you don't send enough ETH", async function () {
            expect(crowdFund.fund()).to.be.revertedWith(
                "CrowdFund__SpendMoreEth"
            )
        })
    })

    describe("Withdraw", async function () {
        beforeEach(async function () {
            await crowdFund.fund({ value: sendValue })
        })
        it("Withdraws ETH from a single founder", async function () {
            const startingCrowdFundBalance =
                await crowdFund.provider.getBalance(crowdFund.address)
            const startingDeployerBalance = await crowdFund.provider.getBalance(
                deployer
            )
            const transactionResponse = await crowdFund.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingCrowdFundBalance = await crowdFund.provider.getBalance(
                crowdFund.address
            )
            const endingDeployerBalance = await crowdFund.provider.getBalance(
                deployer
            )

            assert.equal(endingCrowdFundBalance, 0)
            assert.equal(
                startingCrowdFundBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })

        it("It allows to withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners()
            for (i = 1; i < 11; i++) {
                const crowdFundConnectedContract = await crowdFund.connect(
                    accounts[i]
                )
                await crowdFundConnectedContract.fund({ value: sendValue })
            }
            const startingCrowdFundBalance =
                await crowdFund.provider.getBalance(crowdFund.address)
            const startingDeployerBalance = await crowdFund.provider.getBalance(
                deployer
            )

            const transactionResponse = await crowdFund.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const withdrawGasCost = gasUsed.mul(effectiveGasPrice)

            console.log(`GasCost: ${withdrawGasCost}`)
            console.log(`GasUsed: ${gasUsed}`)
            console.log(`GasPrice: ${effectiveGasPrice}`)
            const endingCrowdFundBalance = await crowdFund.provider.getBalance(
                crowdFund.address
            )
            const endingDeployerBalance = await crowdFund.provider.getBalance(
                deployer
            )

            assert.equal(
                startingCrowdFundBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(withdrawGasCost).toString()
            )
            for (i = 1; i < 11; i++) {
                assert.equal(
                    await crowdFund.getAddressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
        })

        it("Only allows the owner to withdraw", async function () {
            const accounts = ethers.getSigners()
            const hacker = accounts[5]
            const hackerConnectedContract = await crowdFund.connect(hacker)
            await expect(hackerConnectedContract.withdraw()).to.be.revertedWith(
                "CrowdFund__NotOwner"
            )
        })
    })
})
