import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../../context/ContractContext';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'sonner';

const ContractsList = () => {
  const navigate = useNavigate();
  const { contracts, loading, error, fetchContracts } = useContracts();
  const { account } = useWeb3();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        setLocalLoading(true);
        setLocalError(null);
        
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !user) {
          toast.error('Please sign in to view contracts');
          navigate('/signin');
          return;
        }

        console.log('Fetching contracts...');
        const fetchedContracts = await fetchContracts();
        console.log('Fetched contracts:', fetchedContracts);
        
        if (!fetchedContracts || fetchedContracts.length === 0) {
          toast.info('No contracts found');
        }
      } catch (err) {
        console.error('Error in ContractsList:', err);
        setLocalError(err.message || 'Failed to fetch contracts');
        toast.error('Failed to load contracts');
        
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/signin');
        }
      } finally {
        setLocalLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate, fetchContracts]);

  // Debugging logs
  useEffect(() => {
    console.log('Current contracts state:', {
      contracts,
      loading,
      error,
      localLoading,
      localError
    });
  }, [contracts, loading, error, localLoading, localError]);

  if (localLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading contracts...</p>
      </div>
    );
  }

  if (localError || error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded my-4">
        <h3 className="font-bold">Error Loading Contracts</h3>
        <p>{localError || error}</p>
        <div className="mt-4 space-x-2">
          <button 
            onClick={() => {
              setLocalError(null);
              fetchContracts();
            }} 
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/signin')} 
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded my-4">
        <h3 className="font-bold">No Contracts Found</h3>
        <p>You don't have any active contracts yet.</p>
        <div className="mt-4 space-x-2">
          <button 
            onClick={fetchContracts} 
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
          >
            Refresh
          </button>
          <button 
            onClick={() => navigate('/my-jobs')} 
            className="px-4 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Contracts</h1>
        <button
          onClick={fetchContracts}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid gap-6">
        {contracts.map((contract) => (
          <ContractCard 
            key={contract._id} 
            contract={contract} 
            account={account}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

const ContractCard = ({ contract, account, navigate }) => {
  const isClient = account === contract.client?.walletAddress;
  const isFreelancer = account === contract.freelancer?.walletAddress;
  const status = contract.blockchainState?.status || contract.status;

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/contracts/${contract._id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{contract.jobTitle}</h2>
          <p className="text-gray-600 mt-2">{contract.jobDescription}</p>
          <div className="mt-2 flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {isClient ? 'Freelancer' : 'Client'}: {isClient ? contract.freelancer?.name : contract.client?.name}
            </span>
            {contract.contractAddress && (
              <span className="text-sm text-gray-500">
                Contract: {`${contract.contractAddress.substring(0, 6)}...${contract.contractAddress.slice(-4)}`}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{contract.bidAmount} ETH</p>
          <p className="text-sm text-gray-500">
            Deadline: {new Date(contract.deadline).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <StatusBadge status={status} />
          {contract.blockchainState && (
            <SigningStatus 
              clientApproved={contract.blockchainState.clientApproved}
              freelancerApproved={contract.blockchainState.freelancerApproved}
            />
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/contracts/${contract._id}`);
          }}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusMap = {
    created: { color: 'bg-yellow-100 text-yellow-800', text: 'Created' },
    client_signed: { color: 'bg-blue-100 text-blue-800', text: 'Client Signed' },
    freelancer_signed: { color: 'bg-purple-100 text-purple-800', text: 'Freelancer Signed' },
    work_submitted: { color: 'bg-blue-100 text-blue-800', text: 'Work Submitted' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    disputed: { color: 'bg-red-100 text-red-800', text: 'Disputed' }
  };

  const { color, text } = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
      {text}
    </span>
  );
};

const SigningStatus = ({ clientApproved, freelancerApproved }) => {
  const isFullySigned = clientApproved && freelancerApproved;
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${
      isFullySigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      {isFullySigned ? 'Fully Signed' : 'Partially Signed'}
    </span>
  );
};

export default ContractsList;