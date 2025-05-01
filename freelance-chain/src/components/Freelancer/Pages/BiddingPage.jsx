import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BidForm } from '../Cards/BidForm';

export const BiddingPage = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [bids, setBids] = useState([]);

  // Fetch proposal and bids from your backend here
  useEffect(() => {
    // Implementation will be added when we set up the backend
  }, [id]);

  const handleBidSubmit = async (bidData) => {
    // Implementation will be added when we set up the backend
  };

  if (!proposal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Proposals
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{proposal.title}</h1>
            <p className="text-gray-600 mb-6">{proposal.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Budget</p>
                <p className="text-lg font-semibold">${proposal.budget}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-lg font-semibold">
                  {new Date(proposal.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Current Bids</h2>
            <div className="space-y-4">
              {bids.map((bid) => (
                <div key={bid.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">${bid.amount}</p>
                      <p className="text-sm text-gray-500">Delivery: {bid.delivery_time} days</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">{bid.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Place Your Bid</h2>
            <BidForm proposalId={proposal.id} onSubmit={handleBidSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};