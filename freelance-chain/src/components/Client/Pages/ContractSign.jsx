import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';

const ContractSign = ({ contract, onClientSign, onFreelancerSign }) => {
    const { account } = useWeb3();
    const [isSigning, setIsSigning] = useState(false);
    const [error, setError] = useState('');

    const isClient = account?.toLowerCase() === contract.client?.toLowerCase();
    const isFreelancer = account?.toLowerCase() === contract.freelancer?.toLowerCase();

    const handleClientSign = async () => {
        try {
            setIsSigning(true);
            setError('');
            await onClientSign(contract.contractId);
        } catch (err) {
            console.error('Client sign error:', err);
            setError(err.message || 'Failed to sign as client');
        } finally {
            setIsSigning(false);
        }
    };

    const handleFreelancerSign = async () => {
        try {
            setIsSigning(true);
            setError('');
            await onFreelancerSign(contract.contractId);
        } catch (err) {
            console.error('Freelancer sign error:', err);
            setError(err.message || 'Failed to sign as freelancer');
        } finally {
            setIsSigning(false);
        }
    };

    // Check if contract.blockchainState and its properties exist before accessing them
    const clientSignedBlockchain = contract.blockchainState?.clientApproved;
    const freelancerSignedBlockchain = contract.blockchainState?.freelancerApproved;

    if (isClient && clientSignedBlockchain) {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    You've signed as client
                </p>
            </div>
        );
    }

    if (isFreelancer && freelancerSignedBlockchain) {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    You've signed as freelancer
                </p>
            </div>
        );
    }

    if (isClient && !clientSignedBlockchain) {
        return (
            <div className="mt-6">
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Client Signature Required</h4>
                    <p className="text-blue-600 text-sm">
                        As the client, please sign this contract to proceed.
                    </p>
                </div>
                <button
                    onClick={handleClientSign}
                    disabled={isSigning}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
                >
                    {isSigning ? 'Signing...' : 'Sign as Client'}
                </button>
            </div>
        );
    }

    if (isFreelancer && !freelancerSignedBlockchain && clientSignedBlockchain) {
        return (
            <div className="mt-6">
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Freelancer Signature Required</h4>
                    <p className="text-blue-600 text-sm">
                        As the freelancer, please sign this contract to proceed.
                    </p>
                </div>
                <button
                    onClick={handleFreelancerSign}
                    disabled={isSigning}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
                >
                    {isSigning ? 'Signing...' : 'Sign as Freelancer'}
                </button>
            </div>
        );
    }

    return null;
};

export default ContractSign;