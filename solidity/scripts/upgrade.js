const { ethers, upgrades } = require("hardhat");
const { ESCROW_ADDRESS } = require("../../lib/utils.js");

async function main() {
    const Escrow = await ethers.getContractFactory("Escrow"); 
    await upgrades.upgradeProxy(ESCROW_ADDRESS, Escrow); //35960
    console.log('upgraded')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});