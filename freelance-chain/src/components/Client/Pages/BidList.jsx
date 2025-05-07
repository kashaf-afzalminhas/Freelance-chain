import React from 'react';

const BidList = ({ bids, jobId, onStatusChange }) => {
  const handleStatusChange = async (bidId, status) => {
    try {
      await bidService.updateBidStatus(bidId, { status });
      onStatusChange(); // Refresh bids
    } catch (error) {
      console.error('Error updating bid status:', error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Bids Received ({bids.length})</h3>
      
      {bids.length === 0 ? (
        <p>No bids yet</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid._id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{bid.freelancerId?.username || bid.freelancerAddress}</h4>
                  <p className="text-sm text-gray-600">{bid.proposal}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{bid.bidAmount} ETH</p>
                  <p className="text-sm text-gray-500">{bid.estimatedTime}</p>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end space-x-2">
                {bid.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(bid._id, 'accepted')}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleStatusChange(bid._id, 'rejected')}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                <span className={`px-3 py-1 rounded-full text-xs ${
                  bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {bid.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidList;