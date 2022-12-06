const { ethers, upgrades } = require("hardhat");
const {ARB_REW_ETH, FEE_PP} = require("../../lib/utils.js");

async function main() {
    const [ owner ] = await ethers.getSigners();
    const arbitratorReward = hre.ethers.utils.parseEther(String(ARB_REW_ETH));
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await upgrades.deployProxy(Escrow, [arbitratorReward, FEE_PP, owner.address]); //760856
    await escrow.deployed();
    console.log(`deployed at ${escrow.address}`);
    //0x82F22d0bACE16Be4184fe2Ea105F7fE335297F99

    const ARBITRATOR_ROLE = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("ARBITRATOR_ROLE"))
    await escrow.grantRole(ARBITRATOR_ROLE, "0x6c4508da3e765741c54288118710c518ffb551f4"); //59392
    await escrow.grantRole(ARBITRATOR_ROLE, owner.address); //37094
    await escrow.grantRole(ARBITRATOR_ROLE, "0x948b7e1483e37f25a54c5a26a009c30caf9aad9f"); //59392
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//1930618 gas // 2043957 ownable //2,912,856 acces

//USAGE                                                               GAS

//Contract create - LOGIC                                       2,919,436
//Contract create - PROXY_ADMIN                                   486,067
//Contract create - TRANSPARENT_PROXY = what we working with      760,856
//Set - ADM1                                                       59,392
//Set - ADM2                                                       37,094
//Set - ADM3                                                       59,392
//Upgrade                                                          35,960