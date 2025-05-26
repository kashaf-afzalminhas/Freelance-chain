import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContracts } from '../../context/ContractContext';
import ContractSign from './ContractSign';
import WorkSubmission from './WorkSubmission';

const ContractView = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { contracts = [], loading, error, signContract } = useContracts();
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found - redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  const contract = contracts.find(c => c._id === contractId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded my-4">
        Error: {error}
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded my-4">
        Contract not found
      </div>
    );
  }

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
                  <p className="mt-1">{contract.client.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Freelancer</h3>
                  <p className="mt-1">{contract.freelancer.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Bid Amount</h3>
                  <p className="mt-1">{contract.bidAmount} ETH</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Deadline</h3>
                  <p className="mt-1">{new Date(contract.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <ContractSign
                contract={contract}
                onSign={signContract}
              />
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