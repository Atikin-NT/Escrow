const hre = require("hardhat");

async function main() {
    [owner, buyer, seller] = await hre.ethers.getSigners();
    console.log(owner.address, buyer.address, seller.address)
    
    const limit = hre.ethers.utils.parseEther("0.02");
    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(limit);
    await escrow.deployed();
    console.log(escrow.address)
    
    let Bbalance = await buyer.getBalance();// console.log(Bbalance);
    let Sbalance = await seller.getBalance();// console.log(Sbalance);
    let hold = await escrow.hold();// console.log(hold);

    let Bstart = Bbalance, Sstart = Sbalance, Hstart = hold;

    const value = 1e9;

    let transaction = await escrow.connect(buyer).create(buyer.address, seller.address, value, 2); 
    let tx = await transaction.wait();// console.log(tx.events[0].args);
    console.log(tx);
    const TxId = tx.events[0].args.TxId;
    let deal = await escrow.deals(TxId);// console.log(deal);                 //2    //1   //0

    Bbalance = await buyer.getBalance();//console.log(Bbalance.sub(Bstart)); //-13  //-16 //-16 ==
    Sbalance = await seller.getBalance();// console.log(Sbalance.sub(Sstart)); //0   //0   //0
    hold = await escrow.hold();// console.log(hold.sub(Hstart),'\n----------'); //0  //0   //0



    transaction = await escrow.connect(buyer).sendB(TxId, {value: value});
    tx = await transaction.wait();
    deal = await escrow.deals(TxId);// console.log(deal);

    Bbalance = await buyer.getBalance();// console.log(Bbalance.sub(Bstart)); //-20 //-22.7//-22.7==
    Sbalance = await seller.getBalance();// console.log(Sbalance.sub(Sstart)); //0  //0    //0
    hold = await escrow.hold();// console.log(hold.sub(Hstart),'\n----------'); //0 //0    //0



    transaction = await escrow.connect(seller).sendS(TxId);
    tx = await transaction.wait();
    deal = await escrow.deals(TxId);// console.log(deal);

    Bbalance = await buyer.getBalance();// console.log(Bbalance.sub(Bstart)); //-20  //-22.7//-22.7
    Sbalance = await seller.getBalance();// console.log(Sbalance.sub(Sstart)); //-3.7//-3.7 //-3.7
    hold = await escrow.hold();// console.log(hold.sub(Hstart),'\n----------'); //0  //0    //0



    transaction = await escrow.connect(buyer).approve(TxId);
    tx = await transaction.wait();
    deal = await escrow.deals(TxId);// console.log(deal);

    Bbalance = await buyer.getBalance();// console.log(Bbalance.sub(Bstart)); //-27  //-30.3//-30.3
    Sbalance = await seller.getBalance();// console.log(Sbalance.sub(Sstart)); //-3.7//-3.7 //-3.7
    hold = await escrow.hold();// console.log(hold.sub(Hstart),'\n----------'); //>0 //>0   //0
    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});