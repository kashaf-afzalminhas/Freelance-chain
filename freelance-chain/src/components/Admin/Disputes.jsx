import React, { useState, useEffect } from 'react';
import { useDisputes, useResolveDispute } from '../../hooks/useDisputeApi';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../utils/contract';
import { useAdminApi } from '../../hooks/useAdminApi';

const Disputes = () => {
  const { account, provider } = useWeb3();
  const { data: disputesData, isLoading: isLoadingDisputes, error: disputesError } = useDisputes();
  const resolveDisputeMutation = useResolveDispute();
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [clientShare, setClientShare] = useState(5000); // 50% in basis points
  const [freelancerShare, setFreelancerShare] = useState(5000); // 50% in basis points
  const [adminNote, setAdminNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const queryClient = useQueryClient();

  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    if (disputesData) {
      setDisputes(disputesData);
    }
  }, [disputesData]);

  // Add admin function
  const addAdmin = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsAddingAdmin(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Get the current admin
      const currentAdmin = await contract.admin();
      console.log('Current admin:', currentAdmin);

      // Check if the current user is the admin
      if (currentAdmin.toLowerCase() !== account.toLowerCase()) {
        toast.error('Only the contract owner can add new admins');
        return;
      }

      // Add the new admin
      const tx = await contract.addAdmin(account);
      await tx.wait();

      // Verify admin status
      const isAdmin = await contract.isAdmin(account);
      if (isAdmin) {
        setIsAdminVerified(true);
        toast.success('Successfully added as admin');
      } else {
        toast.error('Failed to verify admin status');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      if (error.message?.includes('Only contract owner can add admins')) {
        toast.error('Only the contract owner can add new admins');
      } else {
        toast.error('Failed to add admin: ' + error.message);
      }
    } finally {
      setIsAddingAdmin(false);
    }
  };

  // Verify admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!account || !provider) return;

      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const contractAdmin = await contract.admin();
        setIsAdminVerified(contractAdmin.toLowerCase() === '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1'.toLowerCase());
        
        if (!isAdminVerified) {
          console.log('Wallet is not registered as admin');
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        toast.error('Failed to verify admin status');
      }
    };

    verifyAdmin();
  }, [account, provider]);

  const calculateAmounts = () => {
    if (!selectedDispute) {
      return {
        clientAmount: '0',
        freelancerAmount: '0',
        platformFee: '0'
      };
    }

    try {
      const bidAmount = ethers.utils.parseEther(selectedDispute.bidAmount.toString());
      const disputeFee = selectedDispute.disputeFee ? 
        ethers.utils.parseEther(selectedDispute.disputeFee.toString()) : 
        ethers.BigNumber.from(0);

      const totalAmount = bidAmount.add(disputeFee);
      const platformFee = totalAmount.mul(5).div(100); // 5% platform fee
      const remainingAmount = totalAmount.sub(platformFee);

      const clientAmount = remainingAmount.mul(clientShare).div(10000);
      const freelancerAmount = remainingAmount.sub(clientAmount);

      return {
        clientAmount: ethers.utils.formatEther(clientAmount),
        freelancerAmount: ethers.utils.formatEther(freelancerAmount),
        platformFee: ethers.utils.formatEther(platformFee)
      };
    } catch (error) {
      console.error('Error calculating amounts:', error);
      return {
        clientAmount: '0',
        freelancerAmount: '0',
        platformFee: '0'
      };
    }
  };

  const handleResolveDispute = async () => {
    if (!selectedDispute) return;

    try {
      setIsResolving(true);

      // First verify admin status
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Get the current admin and check admin status
      const contractAdmin = await contract.admin();
      const isAdmin = await contract.isAdmin(account);
      console.log('Admin status check:', { 
        account, 
        contractAdmin,
        isAdmin,
        isTrustedAdmin: ADMIN_WALLET_ADDRESSES.includes(account.toLowerCase())
      });

      if (!isAdmin && contractAdmin.toLowerCase() !== account.toLowerCase()) {
        toast.error('Your wallet is not registered as an admin in the contract');
        return;
      }

      // Proceed with dispute resolution
      await resolveDisputeMutation.mutateAsync({
        contractId: selectedDispute.contractId,
        clientShare,
        freelancerShare,
        adminNote
      });

      // Refresh disputes list
      queryClient.invalidateQueries(['adminDisputes']);
      
      // Reset form
      setSelectedDispute(null);
      setClientShare(5000);
      setFreelancerShare(5000);
      setAdminNote('');
      
      toast.success('Dispute resolved successfully');
    } catch (error) {
      console.error('Error resolving dispute:', error);
      if (error.message?.includes('Only admin can call this')) {
        toast.error('Your wallet is not registered as an admin in the contract');
      } else {
        toast.error(error.response?.data?.message || 'Failed to resolve dispute');
      }
    } finally {
      setIsResolving(false);
    }
  };

  const handleSelectDispute = (dispute) => {
    setSelectedDispute(dispute);
    setClientShare(5000);
    setFreelancerShare(5000);
    setAdminNote('');
  };

  const handleShareChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (type === 'client') {
      setClientShare(value);
      setFreelancerShare(10000 - value);
    } else {
      setFreelancerShare(value);
      setClientShare(10000 - value);
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">Please connect your wallet</h2>
        </div>
      </div>
    );
  }

  if (!isAdminVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Admin Access Required</h2>
          <p className="mt-2 text-gray-500">Your wallet is not registered as an admin in the contract.</p>
          <button
            onClick={addAdmin}
            disabled={isAddingAdmin}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAddingAdmin ? 'Adding Admin...' : 'Add Admin'}
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingDisputes) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D9773]"></div>
      </div>
    );
  }

  if (disputesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error loading disputes</h2>
          <p className="mt-2 text-gray-500">{disputesError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dispute Resolution</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Active Disputes</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {disputes.length > 0 ? (
              disputes.map(dispute => (
                <div
                  key={dispute._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedDispute?._id === dispute._id 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectDispute(dispute)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Contract #{dispute.contractId}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">Client:</span> {dispute.client?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Freelancer:</span> {dispute.freelancer?.name || 'Unknown'}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Disputed
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Amount:</span> {dispute.amount} VG
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Reason:</span> {dispute.rejectionReason || 'No reason provided'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active disputes found</p>
              </div>
            )}
          </div>
        </div>

        {/* Contract Details */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Contract Details</h2>
          {selectedDispute ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{selectedDispute.job?.title || 'No title'}</h3>
                <p className="text-gray-600 text-sm mt-1">{selectedDispute.job?.description || 'No description'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Client</p>
                  <p>{selectedDispute.client?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500 truncate">{selectedDispute.client?.walletAddress || 'No address'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Freelancer</p>
                  <p>{selectedDispute.freelancer?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500 truncate">{selectedDispute.freelancer?.walletAddress || 'No address'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Amount</p>
                  <p>{selectedDispute.amount} VG</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Deadline</p>
                  <p>{new Date(selectedDispute.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Dispute Reason</p>
                <p className="bg-red-50 p-2 rounded text-red-800">{selectedDispute.rejectionReason || 'No reason provided'}</p>
              </div>
              
              {selectedDispute.workHash && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Submitted Work</p>
                  <a 
                    href={`https://ipfs.io/ipfs/${selectedDispute.workHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    View on IPFS
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Select a dispute to view details</p>
            </div>
          )}
        </div>

        {/* Resolution Form */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Resolve Dispute</h2>
          {selectedDispute ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Contract Amount</h3>
                <p className="text-lg font-semibold text-green-600">
                  {calculateAmounts().totalAmount} VANRY
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Share (basis points)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={clientShare}
                  onChange={(e) => handleShareChange(e, 'client')}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {clientShare / 100}% of remaining amount
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Freelancer Share (basis points)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={freelancerShare}
                  onChange={(e) => handleShareChange(e, 'freelancer')}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {freelancerShare / 100}% of remaining amount
                </p>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  <span className="font-semibold">Total Share:</span> {clientShare + freelancerShare}%
                </p>
                <p className="text-sm text-yellow-700">
                  <span className="font-semibold">Total Amount:</span> {calculateAmounts().totalAmount} VANRY
                </p>
                {clientShare + freelancerShare !== 10000 && (
                  <p className="text-sm text-red-500 mt-1">Shares must total exactly 100%</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="4"
                  placeholder="Enter resolution details..."
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleResolveDispute}
                  disabled={isResolving || clientShare + freelancerShare !== 10000}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    isResolving || clientShare + freelancerShare !== 10000
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isResolving ? 'Resolving...' : 'Resolve Dispute'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Select a dispute to resolve</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disputes;