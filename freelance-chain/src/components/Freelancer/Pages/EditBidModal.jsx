import React, { useState } from 'react';

const EditBidModal = ({ bid, onClose, onSubmit }) => {
  const [proposal, setProposal] = useState(bid.proposal);
  const [bidAmount, setBidAmount] = useState(bid.bidAmount);
  const [estimatedTime, setEstimatedTime] = useState(bid.estimatedTime);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (proposal.length < 50) {
      setError('Proposal must be at least 50 characters');
      return;
    }

    if (isNaN(bidAmount)) {
      setError('Please enter a valid bid amount');
      return;
    }

    if (bidAmount < 0.001) {
      setError('Bid amount must be at least 0.001 ETH');
      return;
    }

    onSubmit({
      proposal,
      bidAmount,
      estimatedTime
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-secondary">Edit Proposal</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Proposal</label>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                rows={8}
                required
              />
              <p className="text-sm text-gray-500 mt-1">{proposal.length} / 50 characters minimum</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Bid Amount (ETH)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  step="0.001"
                  min="0.001"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Estimated Time</label>
                <select
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                >
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                  <option value="custom">Custom timeline</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBidModal;