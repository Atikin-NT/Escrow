class EscrowProvider{
    daiAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    daiAbi = [
        "constructor()",
        "function create(address buyer, address seller, uint value) external",
        "function sendB(bytes32 TxId) external payable",
        "function sendS(bytes32 TxId) external",
        "function cancel(bytes32 TxId) external",
        "function approve(bytes32 TxId) external",
        "function disapprove(bytes32 TxId) external",
        "function withdraw(address target) external",
        "function hold() external view returns(uint256)",
        "function owner() external view returns(address)",
        "function deals(bytes32) external view returns(address buyer, address seller, uint256 value, uint8 status)",
        "event Created(address buyer, address seller, bytes32 TxId)",
        "event BuyerConfim(bytes32 TxId)",
        "event SellerConfim(bytes32 TxId)",
        "event Finished(bytes32 TxId)"
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