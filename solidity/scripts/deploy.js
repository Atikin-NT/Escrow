// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const limit = hre.ethers.utils.parseEther("0.06");
    const arbitratorReward = hre.ethers.utils.parseEther("0.02");
    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(limit, arbitratorReward); //1930618 gas // 2043957 ownable //2912856 acces
    await escrow.deployed();
    console.log(`deployed at ${escrow.address}`);

    const ARBITRATOR_ROLE = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("ARBITRATOR_ROLE"))
    await escrow.grantRole(ARBITRATOR_ROLE, "0x6c4508da3e765741c54288118710c518ffb551f4");
    await escrow.grantRole(ARBITRATOR_ROLE, "0xf952924197d795ee179aa06bf83aab3f604372de");
    await escrow.grantRole(ARBITRATOR_ROLE, "0x948b7e1483e37f25a54c5a26a009c30caf9aad9f");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });