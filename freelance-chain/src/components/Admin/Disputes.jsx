import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDisputes, useDisputeDetails, useResolveDispute } from '../../hooks/useDisputeApi';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-toastify';

const Disputes = () => {
  const { account } = useWeb3();
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionForm, setResolutionForm] = useState({
    clientShare: '',
    freelancerShare: '',
    adminNote: ''
  });

  // Fetch all disputes
  const { 
    data: disputes, 
    isLoading: isLoadingList,
    error: listError,
    refetch: refetchDisputes 
  } = useDisputes();

  // Fetch specific dispute details if contractId is provided
  const { 
    data: disputeDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
    refetch: refetchDetails
  } = useDisputeDetails(contractId);

  // Resolve dispute mutation
  const { 
    resolveDispute,
    isLoading: isResolving
  } = useResolveDispute();

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;

    try {
      await resolveDispute({
        contractId: selectedDispute._id,
        ...resolutionForm
      });
      
      toast.success('Dispute resolved successfully');
      setSelectedDispute(null);
      setResolutionForm({
        clientShare: '',
        freelancerShare: '',
        adminNote: ''
      });
      refetchDisputes();
    } catch (error) {
      toast.error(error.message || 'Failed to resolve dispute');
    }
  };

  if (isLoadingList || isLoadingDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (listError || detailsError) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading disputes. Please try again.</p>
        <button 
          onClick={() => refetchDisputes()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // If we have a contractId, show the dispute details
  if (contractId && disputeDetails) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/disputes')}
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Disputes
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Dispute Details</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Contract Information</h3>
              <p><span className="font-medium">Contract ID:</span> {disputeDetails._id}</p>
              <p><span className="font-medium">Job Title:</span> {disputeDetails.job?.title}</p>
              <p><span className="font-medium">Status:</span> {disputeDetails.status}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Parties</h3>
              <p><span className="font-medium">Client:</span> {disputeDetails.client?.name}</p>
              <p><span className="font-medium">Freelancer:</span> {disputeDetails.freelancer?.name}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-2">Dispute Information</h3>
            <p><span className="font-medium">Reason:</span> {disputeDetails.disputeReason}</p>
            <p><span className="font-medium">Raised By:</span> {disputeDetails.disputeRaisedBy}</p>
            <p><span className="font-medium">Raised At:</span> {new Date(disputeDetails.disputeRaisedAt).toLocaleString()}</p>
          </div>

          <form onSubmit={handleResolveDispute} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Share (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={resolutionForm.clientShare}
                onChange={(e) => setResolutionForm(prev => ({ ...prev, clientShare: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Freelancer Share (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={resolutionForm.freelancerShare}
                onChange={(e) => setResolutionForm(prev => ({ ...prev, freelancerShare: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Note</label>
              <textarea
                value={resolutionForm.adminNote}
                onChange={(e) => setResolutionForm(prev => ({ ...prev, adminNote: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isResolving}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isResolving ? 'Resolving...' : 'Resolve Dispute'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show the list of disputes
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Active Disputes</h2>
      
      {disputes && disputes.length > 0 ? (
        <div className="grid gap-6">
          {disputes.map((dispute) => (
            <div key={dispute._id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Contract ID</p>
                  <p className="font-medium">{dispute._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="font-medium">{dispute.job?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{dispute.client?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Freelancer</p>
                  <p className="font-medium">{dispute.freelancer?.name}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/admin/disputes/${dispute._id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No active disputes found</p>
        </div>
      )}
    </div>
  );
};

export default Disputes; 