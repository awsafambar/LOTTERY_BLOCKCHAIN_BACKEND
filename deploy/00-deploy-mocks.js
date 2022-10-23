const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25"), // 0.25 is this the premium in LINK?
    GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

module.exports = async () => {
    const { deploy, log } = deployments,
        { deployer } = await getNamedAccounts(),
        // console.log("deployer", deployer, DECIMALS, INITIAL_ANSWER);
        chainId = network.config.chainId

    // If we are on a local development network, we need to deploy mocks!

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })

        log("Mocks Deployed!")
        log("----------------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
