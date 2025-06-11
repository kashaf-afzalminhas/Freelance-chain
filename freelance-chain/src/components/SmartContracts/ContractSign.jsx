// frontend/components/ContractSign.jsx
import React, { useState } from 'react';
import { useContract } from "@thirdweb-dev/react";
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'sonner';

const ContractSign = ({ contract, onSign }) => {
    const { account } = useWeb3();
    const { contract: jobContract } = useContract(process.env.REACT_APP_CONTRACT_ADDRESS);
    const [isSigning, setIsSigning] = useState(false);
    const [error, setError] = useState('');

    const handleSign = async () => {
        try {
            setIsSigning(true);
            setError('');
            
            // Sign contract on blockchain
            const tx = await jobContract.call("signContract", [contract.contractId]);
            await tx.wait();
            
            // Update backend
            await onSign(contract._id, account);
            
            toast.success('Contract signed successfully!');
        } catch (err) {
            console.error('Sign contract error:', err);
            setError(err.message || 'Failed to sign contract');
            toast.error('Failed to sign contract');
        } finally {
            setIsSigning(false);
        }
    };

    const isClient = account === contract.client?.walletAddress;
    const isFreelancer = account === contract.freelancer?.walletAddress;
    const isSigned = (isClient && contract.clientSigned) || (isFreelancer && contract.freelancerSigned);

    if (isSigned) {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    You've already signed this contract
                </p>
            </div>
        );
    }

    if ((isClient && !contract.clientSigned) || (isFreelancer && !contract.freelancerSigned)) {
        return (
            <div className="mt-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Smart Contract Signing</h4>
                    <p className="text-blue-600 text-sm">
                        By signing this contract, you agree to the terms and conditions. 
                        This action will be recorded on the blockchain.
                    </p>
                </div>
                <button
                    onClick={handleSign}
                    disabled={isSigning}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
                >
                    {isSigning ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing...
                        </span>
                    ) : 'Sign Contract'}
                </button>
            </div>
        );
    }

    return null;
};

export default ContractSign;