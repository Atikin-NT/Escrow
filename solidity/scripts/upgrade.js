const { ethers, upgrades } = require("hardhat");

async function main() {
    const ESC_ADDRESS = "0x82F22d0bACE16Be4184fe2Ea105F7fE335297F99";
    const Escrow = await ethers.getContractFactory("Escrow"); 
    await upgrades.upgradeProxy(ESC_ADDRESS, Escrow); //35960
    console.log('upgraded')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});