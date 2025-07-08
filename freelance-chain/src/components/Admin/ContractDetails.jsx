import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContractDetails = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { account } = useWeb3();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          `http://localhost:5000/api/admin/contracts/${contractId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'x-admin-wallet': account.toLowerCase()
            }
          }
        );

        setContract(response.data.contract);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load contract details');
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchContractDetails();
    }
  }, [contractId, account]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D9773]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/admin/contracts')}
          className="mt-4 px-4 py-2 bg-[#0C3B2E] text-white rounded-md hover:bg-[#6D9773] transition-colors"
        >
          Back to Contracts
        </button>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Contract Not Found</h2>
        <button
          onClick={() => navigate('/admin/contracts')}
          className="mt-4 px-4 py-2 bg-[#0C3B2E] text-white rounded-md hover:bg-[#6D9773] transition-colors"
        >
          Back to Contracts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/contracts')}
          className="flex items-center text-[#0C3B2E] hover:text-[#BB8A52] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Contracts
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-[#0C3B2E]">
          <h3 className="text-lg leading-6 font-medium text-white">
            Contract Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-200">
            Contract ID: {contract.contractId}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {[
              { label: 'Status', value: contract.status, highlight: true },
              { label: 'Client', value: `${contract.client?.name || 'Unknown'} (${contract.client?.walletAddress})` },
              { label: 'Freelancer', value: `${contract.freelancer?.name || 'Unknown'} (${contract.freelancer?.walletAddress})` },
              { label: 'Amount', value: `${contract.bidAmount} VG` },
              { label: 'Job Title', value: contract.job?.title || 'N/A' },
              { label: 'Job Description', value: contract.job?.description || 'N/A' },
              { label: 'Created At', value: new Date(contract.createdAt).toLocaleString() },
              { label: 'Last Updated', value: new Date(contract.updatedAt).toLocaleString() },
            ].map((item, index) => (
              <div key={index} className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {item.highlight ? (
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-4 ${
                      contract.status === 'disputed' 
                        ? 'bg-red-100 text-red-800'
                        : contract.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.status}
                    </span>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;