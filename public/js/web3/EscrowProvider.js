class EscrowProvider{
    daiAddress = "0x8d4Da75889CA76C55c4eAaf1A3C338c5902C7a98";
    daiAbi = [
        {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"BuyerConfim","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"Created","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"Finished","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"SellerConfim","type":"event"},
        {"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"checkUpkeep","outputs":[{"internalType":"bool","name":"upkeepNeeded","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address","name":"seller","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"create","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"deals","outputs":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address","name":"seller","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint8","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"disapprove","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[],"name":"hold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"performUpkeep","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"sendB","outputs":[],"stateMutability":"payable","type":"function"},
        {"inputs":[{"internalType":"bytes32","name":"TxId","type":"bytes32"}],"name":"sendS","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"stateMutability":"payable","type":"receive"}
    ];
    daiContract;
    estimateGas;

    constructor(signer){
        this.daiContract = new ethers.Contract(this.daiAddress, this.daiAbi, signer);
        this.estimateGas = this.daiContract.estimateGas;
    }

    connect(signer) {
        this.daiContract = this.daiContract.connect(signer)
    }

    async create(buyer, seller, value, tx={}) {
        return await this.daiContract.create(buyer, seller, value, tx);
    }

    async sendB(TxId, tx={}){
        return await this.daiContract.sendB(TxId, tx);
    }

    async sendS(TxId, tx={}){
        return await this.daiContract.sendS(TxId, tx);
    }

    async cancel(TxId, tx={}){
        return await this.daiContract.cancel(TxId, tx);
    }

    async approve(TxId, tx={}){
        return await this.daiContract.approve(TxId, tx);
    }

    async disapprove(TxId, tx={}){
        return await this.daiContract.disapprove(TxId, tx);
    }

    async withdraw(target, tx={}){
        return await this.daiContract.withdraw(target, tx);
    }

    async hold() {
        return await this.daiContract.hold();
    }

    async owner() {
        return await this.daiContract.owner();
    }

    async deals(TxId) {
        return await this.daiContract.deals(TxId);
    }
}