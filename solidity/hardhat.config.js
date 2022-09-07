require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { API_URL, GOERLI_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
    },
    goerli: {
      url: API_URL,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};
