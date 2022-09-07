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

    async createDealByBuyer(address){
        this.daiContract.transferTo(address);
    }

    async createDealBySeller(address){
        await daiContract.createDealBySeller(address);
    }

    async moneyForMeFrom(address){
        var balance = await this.daiContract.moneyForMeFrom(address);
        console.log("getBalance = " + balance);
    }

    async moneyForMeConfim(address){
        await daiContract.moneyForMeConfim(address);
    }

    async moneyForMeCancel(address){
        await daiContract.moneyForMeCancel(address);
    }

    async sendActionConfim(address){
        await daiContract.sendActionConfim(address);
    }

    async getBoxConfim(address){
        await daiContract.getBoxConfim(address);
    }

    async getBoxCancel(address){
        await daiContract.getBoxCancel(address);
    }

    async getBalance(){
        var balance = await this.daiContract.getBalance();
        console.log("getBalance = " + balance);
    }

    async sendToAdmin(){
        await daiContract.sendToAdmin();
    }

    get daiAddress(){
        return this.daiAddress;
    }
}

module.exports = GarantProvider;