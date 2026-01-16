const needsDeposit = isClient && 
                     contract.blockchainState && 
                     contract.blockchainState.fundsDeposited === '0.0';

{needsDeposit ? (
    <button
        onClick={handleDeposit}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 mt-4"
        disabled={localLoading}
    >
        Deposit Funds ({contract.bidAmount} ETH)
    </button>
) : canSign && (
    <ContractSign
        contract={contract}
        onSign={handleSign}
    />
)} 