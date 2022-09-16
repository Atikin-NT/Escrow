class EscrowProvider{
    daiAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    daiAbi = [
        "function create(address buyer, address seller, uint value) external",
        "function sendB(address seller) external payable",
        "function sendS(address buyer) external",
        "function cancel(address buyer, address seller) external",
        "function approve(address seller) external",
        "function disapprove(address seller) external",
        "function withdraw() external"
        ];
    daiContract;
    
    constructor(signer){
        this.daiContract = new ethers.Contract(this.daiAddress, this.daiAbi, signer);
    }

    async create(buyer, seller, value, tx={}){
        await this.daiContract.create(buyer, seller, value, tx);
    }

    async sendB(seller, tx={}){
        await this.daiContract.sendB(seller, tx);
    }

    async sendS(buyer, tx={}){
        await this.daiContract.sendS(buyer, tx);
    }

    async cancel(buyer, seller, tx={}){
        await this.daiContract.cancel(buyer, seller, tx);
    }

    async approve(seller, tx={}){
        await this.daiContract.approve(seller, tx);
    }

    async disapprove(seller, tx={}){
        await this.daiContract.disapprove(seller, tx);
    }

    async withdraw(tx={}){
        await this.daiContract.withdraw(tx);
    }
}   