import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bidService } from '../../../services/api';
import EditBidModal from './EditBidModal';
import { FileText } from 'lucide-react';

const MyProposals = () => {
    const [bids, setBids] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBid, setSelectedBid] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
  
    useEffect(() => {
      const fetchBids = async () => {
        try {
          const response = await bidService.getMyBids();
          // Ensure we're working with an array
          setBids(Array.isArray(response?.data) ? response.data : []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBids();
    }, []);

  const handleEditBid = (bid) => {
    setSelectedBid(bid);
    setShowEditModal(true);
  };

  const handleUpdateBid = async (formData) => {
    try {
      // Submit the update
      await bidService.updateBid(selectedBid._id, formData);
      
      // Refetch the updated bid details
      const updatedBidResponse = await bidService.getBidDetails(selectedBid._id);
      const updatedBid = updatedBidResponse.data;

      // Update the bids list in the state with the refetched data
      setBids(bids.map(b => b._id === updatedBid._id ? updatedBid : b));
      
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating bid:', err);
      setError(err.message || "Failed to update bid");
    }
  };

  const handleFileClick = (file) => {
    // Construct the full URL using the API base URL
    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';
    const fileUrl = `${baseUrl}${file.url}`;
    
    console.log('Opening file:', {
      originalUrl: file.url,
      fullUrl: fileUrl,
      fileType: file.type
    });

    if (file.type === 'image' || file.type === 'pdf') {
      window.open(fileUrl, '_blank');
    } else {
      // For other file types, trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded my-4">
      <p>Error: {error}</p>
    </div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-secondary">My Proposals</h1>
      
      {bids.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 mb-6 text-lg">You haven't submitted any proposals yet</p>
          <Link to="/jobs" className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 inline-flex items-center transition duration-200">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map(bid => (
            <div key={bid._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-secondary">
                    <Link to={bid.jobId && bid.jobId._id ? `/jobs/${bid.jobId._id}` : "#"} className="hover:text-primary">
                      {bid.jobId && bid.jobId.title ? bid.jobId.title : "Unknown Job"}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {bid.jobId && bid.jobId.description ? bid.jobId.description.substring(0, 100) + "..." : ""}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {bid.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Bid Amount</p>
                  <p className="font-bold text-accent">${bid.bidAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Time</p>
                  <p className="font-bold">{bid.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-bold">{new Date(bid.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {bid.bidMedia && bid.bidMedia.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h4>
                  <div className="flex flex-wrap gap-2">
                    {bid.bidMedia.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => handleFileClick(file)}
                        className="flex items-center px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                      >
                        {file.type === 'image' ? (
                          <img
                            src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${file.url}`}
                            alt={file.name}
                            className="h-8 w-8 object-cover rounded mr-2"
                          />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-600">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleEditBid(bid)}
                  disabled={bid.status !== 'pending'}
                  className={`px-4 py-2 rounded-md font-medium ${
                    bid.status !== 'pending' ? 
                    'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                    'bg-primary text-white hover:bg-opacity-90'
                  }`}
                >
                  Edit Proposal
                </button>
                <Link 
                  to={bid.jobId && bid.jobId._id ? `/jobs/${bid.jobId._id}` : "#"}
                  className="px-4 py-2 rounded-md font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

{showEditModal && selectedBid && (
        <EditBidModal
          bid={selectedBid}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateBid}
        />
      )}
    </div>
  );
};

export default MyProposals;