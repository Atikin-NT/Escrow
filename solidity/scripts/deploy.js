// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const limit = hre.ethers.utils.parseEther("0.02");
    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(limit);
    await escrow.deployed();
    console.log(`deployed at ${escrow.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });