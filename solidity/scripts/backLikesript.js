const { ethers, upgrades } = require("hardhat");

async function main() {
    const [owner, buyer, seller, arbitrator] = await ethers.getSigners();
    console.log(owner.address, buyer.address, seller.address)

    const feePercent = 2;
    const arbitratorReward = hre.ethers.utils.parseEther("0.02");
    const Escrow = await ethers.getContractFactory("Escrow");
    let ob = await owner.getBalance();
    const escrow = await upgrades.deployProxy(Escrow, [arbitratorReward, feePercent, owner.address]);
    await escrow.deployed();
    console.log(`deployed at ${escrow.address}`);
    console.log(ethers.utils.formatEther((ob).sub(await owner.getBalance())))
    console.log((ob).sub(await owner.getBalance()))
    ob = await owner.getBalance();
    await upgrades.upgradeProxy(escrow.address, Escrow);
    console.log('upgraded')
    console.log(ethers.utils.formatEther((ob).sub(await owner.getBalance())))
    console.log((ob).sub(await owner.getBalance()))


    // const ARBITRATOR_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ARBITRATOR_ROLE"))
    // await escrow.grantRole(ARBITRATOR_ROLE, arbitrator.address);
    // await escrow.grantRole(ARBITRATOR_ROLE, owner.address);

    // ethers.utils.formatEther(await owner.getBalance())
    // let ob = await owner.getBalance(),
    //     bb = await buyer.getBalance(),
    //     sb = await seller.getBalance(),
    //     eb = await escrow.hold();

    // console.log(ob);
    // console.log(bb);
    // console.log(sb);
    // console.log(eb);
    
    // const value = ethers.utils.parseEther("0.0002");
    // let transaction = await escrow.connect(buyer).create(buyer.address, seller.address, value, 0);
    // let tx = await transaction.wait();
    // TxId = tx.events[0].args.TxId;
    // console.log((await escrow.deals(TxId)).slice());


    // await escrow.connect(buyer).sendB(TxId, {value: value});
    // await transaction.wait();
    // console.log((await escrow.deals(TxId)).slice());


    // await escrow.connect(seller).sendS(TxId);
    // await transaction.wait();
    // console.log((await escrow.deals(TxId)).slice());

    // await escrow.connect(buyer).askArbitrator(TxId, arbitrator.address, {value: arbitratorReward});
    // await transaction.wait();
    // console.log((await escrow.deals(TxId)).slice());
    
    // // await escrow.connect(buyer).approve(TxId);
    // // await transaction.wait();
    // // console.log((await escrow.deals(TxId)).slice());
    
    // await escrow.connect(arbitrator).disapprove(TxId);
    // await transaction.wait();
    // console.log((await escrow.deals(TxId)).slice());


    // console.log( ethers.utils.formatEther((await owner.getBalance()).sub(ob)));
    // console.log((await buyer.getBalance()).sub(bb));
    // console.log((await seller.getBalance()).sub(sb));
    // console.log((await escrow.hold()).sub(eb));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});