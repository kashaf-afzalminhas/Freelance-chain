import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContracts } from '../../context/ContractContext';
import { useWeb3 } from '../../context/Web3Context';
import ContractSign from './ContractSign';
import WorkSubmission from './WorkSubmission';
import { toast } from 'sonner';

const ContractView = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { contracts, loading, error, signContract, getContract } = useContracts();
  const { account } = useWeb3();
  const [activeTab, setActiveTab] = useState('details');
  const [contract, setContract] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
useEffect(() => {
  const loadContract = async () => {
    try {
      setLocalLoading(true);
      
      // First try to get from context
      const contextContract = contracts.find(c => c._id === contractId);
      if (contextContract) {
        setContract(contextContract);
      }

      // Always fetch fresh data
      const freshContract = await getContract(contractId);
      setContract(freshContract);
    } catch (err) {
      console.error('Error loading contract:', err);
      toast.error('Failed to load contract: ' + err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  if (contractId) {
    loadContract();
  }
}, [contractId, getContract, contracts]);

  const handleSign = async (contractId, signerAddress) => {
    try {
      const updatedContract = await signContract(contractId, signerAddress);
      setContract(updatedContract);
      toast.success('Contract signed successfully');
    } catch (err) {
      console.error('Error signing contract:', err);
      toast.error('Failed to sign contract: ' + err.message);
    }
  };

  if (loading || localLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded my-4">
        <h3 className="font-bold">Error Loading Contract</h3>
        <p>{error}</p>
        <button 
          onClick={() => getContract(contractId)} 
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded my-4">
        <h3 className="font-bold">Contract Not Found</h3>
        <p>Could not find contract with ID: {contractId}</p>
        <button 
          onClick={() => navigate('/contracts')} 
          className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
        >
          Back to Contracts
        </button>
      </div>
    );
  }

  const isClient = account === contract.client?.walletAddress;
  const isFreelancer = account === contract.freelancer?.walletAddress;
  const canSign = (isClient && !contract.clientSigned) || (isFreelancer && !contract.freelancerSigned);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-secondary">{contract.jobTitle}</h1>
          <p className="text-gray-600 mt-2">{contract.jobDescription}</p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Contract Details
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'work' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Work Submission
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-500">Client</h3>
                  <p className="mt-1">{contract.client?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{contract.client?.walletAddress || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Freelancer</h3>
                  <p className="mt-1">{contract.freelancer?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{contract.freelancer?.walletAddress || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Bid Amount</h3>
                  <p className="mt-1">{contract.bidAmount} ETH</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Deadline</h3>
                  <p className="mt-1">{new Date(contract.deadline).toLocaleDateString()}</p>
                </div>
                {contract.contractAddress && (
                  <>
                    <div>
                      <h3 className="font-medium text-gray-500">Smart Contract Address</h3>
                      <p className="mt-1 text-sm break-all">{contract.contractAddress}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Transaction Hash</h3>
                      <p className="mt-1 text-sm break-all">{contract.transactionHash}</p>
                    </div>
                  </>
                )}
              </div>

              {contract.blockchainState && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Blockchain State</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{contract.blockchainState.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Client Approved</p>
                      <p className="font-medium">{contract.blockchainState.clientApproved ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Freelancer Approved</p>
                      <p className="font-medium">{contract.blockchainState.freelancerApproved ? 'Yes' : 'No'}</p>
                    </div>
                    {contract.blockchainState.workSubmissionHash && (
                      <div>
                        <p className="text-sm text-gray-500">Work Submission Hash</p>
                        <p className="font-medium break-all">{contract.blockchainState.workSubmissionHash}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {canSign && (
                <ContractSign
                  contract={contract}
                  onSign={handleSign}
                />
              )}
            </div>
          ) : (
            <WorkSubmission contract={contract} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractView;