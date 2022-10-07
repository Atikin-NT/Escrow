const dealPartnerLabel = document.getElementById("deal-parner-label");

function BuyerSellerSwitch(a){
    if(a == 0){
        dealPartnerLabel.innerHTML = "Seller address";
    }
    else{
        dealPartnerLabel.innerHTML = "Buyer address";
    }
}

export { BuyerSellerSwitch };