require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.utils.formatEther(balance), "ETH");
  });

// const { API_URL, GOERLI_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  // networks: {
  //   hardhat: {
  //   },
  //   goerli: {
  //     url: API_URL,
  //     accounts: [GOERLI_PRIVATE_KEY],
  //   },
  // },
};
