event FundsDeposited(uint256 contractId, uint256 amount);

function depositFunds(uint256 _contractId) external payable {
    Contract storage contractItem = contracts[_contractId];
    require(msg.sender == contractItem.client, "Only client can deposit funds");
    require(msg.value == contractItem.bidAmount, "Must deposit exact bid amount");
    require(contractItem.fundsDeposited == 0, "Funds already deposited");
    
    contractItem.fundsDeposited = msg.value;
    escrowBalances[_contractId] = msg.value;
    emit FundsDeposited(_contractId, msg.value);
} 