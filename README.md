# LOTTERY_BLOCKCHAIN_BACKEND

  Check Master Branch for all the code.
  
 *steps for making Server Ready Use after npm install*
 
 1. Get your SubId for chainLink VRF from https://vrf.chain.link/ after creating the subcription and fun TESTLINK using your own Wallet.
 2. Change values in .env file and hardhat-config-helper with your own test network(I choose Goerli test network of my wallet).
 3. Run npx hardhat deploy --network Goerli(or any other network of which you configured above in step 2).
 4. After successfull deploy copy contract adderess and add it in consumer at https://vrf.chain.link/ in subscription page.
 5. Also register on https://automation.chain.link/ with custom logic contract address and fund with 8 TEST LINKS.(chainlink and keepers)
 6. 
