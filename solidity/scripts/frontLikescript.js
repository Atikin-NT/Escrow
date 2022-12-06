const hre = require("hardhat");
const Escrow = require("../artifacts/contracts/Escrow.sol/Escrow.json")
const { ESCROW_ADDRESS } = require("../../lib/utils.js");

async function main() {
    const provider = new hre.ethers.providers.JsonRpcProvider();
    const [owner, buyer, seller, arbitrator] = await ethers.getSigners();
    const escrow = new hre.ethers.Contract(ESCROW_ADDRESS, Escrow.abi, owner)
    console.log(await escrow.hold());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});