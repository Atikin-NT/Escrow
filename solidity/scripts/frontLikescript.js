const hre = require("hardhat");
const Escrow = require("../artifacts/contracts/Escrow.sol/Escrow.json")

async function main() {
    const provider = new hre.ethers.providers.JsonRpcProvider();
    const [owner, buyer, seller, arbitrator] = await ethers.getSigners();
    const address = "0x67d269191c92Caf3cD7723F116c85e6E9bf55933";
    const escrow = new hre.ethers.Contract(address, Escrow.abi, owner)
    console.log(await escrow.hold());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});