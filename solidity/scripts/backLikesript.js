const { ethers, upgrades } = require("hardhat");
const {ARB_REW_ETH, FEE_PP} = require("../../lib/utils.js");

async function main() {
    const [owner, buyer, seller, arbitrator] = await ethers.getSigners();
    console.log(owner.address, buyer.address, seller.address, arbitrator.address)

    const arbitratorReward = hre.ethers.utils.parseEther(String(ARB_REW_ETH));
    const Escrow = await ethers.getContractFactory("Escrow");
    // let ob = await owner.getBalance();
    const escrow = await upgrades.deployProxy(Escrow, [arbitratorReward, FEE_PP, owner.address]);
    await escrow.deployed();
    console.log(`deployed at ${escrow.address}`);
    // console.log(ethers.utils.formatEther((ob).sub(await owner.getBalance())))
    // console.log((ob).sub(await owner.getBalance()))
    // ob = await owner.getBalance();
    await upgrades.upgradeProxy(escrow.address, Escrow);
    console.log('upgraded')
    // console.log(ethers.utils.formatEther((ob).sub(await owner.getBalance())))
    // console.log((ob).sub(await owner.getBalance()))


    const ARBITRATOR_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ARBITRATOR_ROLE"))
    await escrow.grantRole(ARBITRATOR_ROLE, arbitrator.address);
    await escrow.grantRole(ARBITRATOR_ROLE, owner.address);

    ethers.utils.formatEther(await owner.getBalance())
    let ob = await owner.getBalance(),
        bb = await buyer.getBalance(),
        sb = await seller.getBalance(),
        eb = await escrow.hold();

    console.log(ob);
    console.log(bb);
    console.log(sb);
    console.log(eb);
    
    const value = ethers.utils.parseEther("0.0002");
    let transaction = await escrow.connect(buyer).create(buyer.address, seller.address, value, 0);
    let tx = await transaction.wait();
    TxId = tx.events[0].args.TxId;
    console.log((await escrow.deals(TxId)).slice());

    transaction = await escrow.connect(buyer).sendB(TxId, {value: value});
    await transaction.wait();

    transaction = await escrow.connect(seller).sendS(TxId);
    await transaction.wait();

    transaction = await escrow.connect(buyer).askArbitrator(TxId, arbitrator.address, {value: arbitratorReward});
    await transaction.wait();
    console.log((await escrow.deals(TxId)).slice());
    
    // transaction = await escrow.connect(buyer).approve(TxId);
    // tx = await transaction.wait();
    // console.log(tx);

    // transaction = await escrow.connect(arbitrator).disapprove(TxId); //61374 [DEPRECATED]
    // transaction = await escrow.connect(arbitrator).approve(TxId); //64017
    transaction = await escrow.connect(arbitrator).finish(TxId, 20); //100: 67636, 0: 67627, 50: 72987, 80: 72996, 20: 72996
    tx = await transaction.wait();
    console.log(tx);


    console.log( ethers.utils.formatEther((await owner.getBalance()).sub(ob)));
    console.log((await buyer.getBalance()).sub(bb));
    console.log((await seller.getBalance()).sub(sb));
    console.log((await escrow.hold()).sub(eb));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});