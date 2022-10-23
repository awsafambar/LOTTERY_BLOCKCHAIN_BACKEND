const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const FUND_AMOUNT = ethers.utils.parseEther("1") // 1 Ether, or 1e18 (10^18) Wei

module.exports = async () => {
    const { deploy, log } = deployments,
        { deployer } = await getNamedAccounts(),
        chainId = network.config.chainId

    let VRFCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        VRFCoordinatorV2Address = VRFCoordinatorV2Mock.address

        // console.log("point a VRFCoordinatorV2Address", { VRFCoordinatorV2Address })
        /**
         * Creation of subscription ID not from UI but programitically
         */
        const transactionResponse = await VRFCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId

        // console.log("point b", { subscriptionId })
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund

        const ans = await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
        // console.log("point c", { ans })
    } else {
        VRFCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"],
        gasLane = networkConfig[chainId]["gasLane"],
        callbackGasLimit = networkConfig[chainId]["callbackGasLimit"],
        interval = networkConfig[chainId]["interval"]

    const args = [
        VRFCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ]

    // console.log("point d args", args)
    // console.log("point d raffle", { args }, deployer, network.config.blockConfirmations)
    const raffle = await deploy("Raffle", {
        from: deployer,
        log: true,
        args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (chainId == 31337) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), raffle.address)
        log("adding consumer...")
        log("Consumer added!")
    }

    // console.log("point e raffle", { raffle })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }

    log("Enter lottery with command:")
    const networkName = network.name == "hardhat" ? "localhost" : network.name
    log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]
