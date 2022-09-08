const ethers = require("ethers");

class GarantProvider{
    daiAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    daiAbi = [
        "function transferTo(address to) external payable",
        "function moneyForMeFrom(address buyer) external view returns (uint)",
        "function moneyForMeConfim(address buyer) external",
        "function moneyForMeCancel(address buyer) external",
        "function sendActionConfim(address buyer) external",
        "function getBoxConfim(address seller) external",
        "function getBoxCancel(address seller) external",
        "function getBalance() external view returns(uint)",
        "function sendToAdmin() external"
        ];
    daiContract;
    
    constructor(provider){
        this.daiContract = new ethers.Contract(this.daiAddress, this.daiAbi, provider);
    }

    async createDealByBuyer(address, tx){
        await this.daiContract.transferTo(address, tx);
    }

    async createDealBySeller(address, tx){
        await this.daiContract.createDealBySeller(address, tx);
    }

    async moneyForMeFrom(address, tx){
        var balance = await this.daiContract.moneyForMeFrom(address, tx);
        return balance;
    }

    async moneyForMeConfim(address, tx){
        await this.daiContract.moneyForMeConfim(address, tx);
    }

    async moneyForMeCancel(address, tx){
        await this.daiContract.moneyForMeCancel(address, tx);
    }

    async sendActionConfim(address, tx){
        await this.daiContract.sendActionConfim(address, tx);
    }

    async getBoxConfim(address, tx){
        await this.daiContract.getBoxConfim(address, tx);
    }

    async getBoxCancel(address, tx){
        await this.daiContract.getBoxCancel(address, tx);
    }

    async getBalance(){
        var balance = await this.daiContract.getBalance(tx);
        return balance;
    }

    async sendToAdmin(){
        await this.daiContract.sendToAdmin(tx);
    }
}

module.exports = GarantProvider;