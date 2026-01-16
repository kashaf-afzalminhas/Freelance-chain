import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bidService } from '../../../services/api';
import { ArrowLeft, File, Image, Video, FileText } from 'lucide-react';

const BidDetails = () => {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const response = await bidService.getBidDetails(bidId);
        setBid(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load bid details');
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetails();
  }, [bidId]);

  const handleAcceptBid = async () => {
    try {
      await bidService.updateBidStatus(bidId, { status: 'accepted' });
      navigate(`/contracts/create?jobId=${bid.jobId._id}&bidId=${bidId}`);
    } catch (err) {
      setError(err.message || 'Failed to accept bid');
    }
  };

  const handleRejectBid = async () => {
    try {
      await bidService.updateBidStatus(bidId, { status: 'rejected' });
      navigate(`/jobs/${bid.jobId._id}`);
    } catch (err) {
      setError(err.message || 'Failed to reject bid');
    }
  };

  const handleFileClick = (file) => {
    // Construct the full URL using the API base URL
    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';
    const fileUrl = `${baseUrl}${file.url}`;
    
    console.log('Opening file from BidDetails:', {
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

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

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
        <p>{error}</p>
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded my-4">
        <p>Bid not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Proposal for {bid.jobId.title}
              </h1>
              <p className="text-gray-600">
                Submitted by {bid.freelancerId.username}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Bid Amount</p>
              <p className="text-2xl font-bold text-primary">{bid.bidAmount} ETH</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Estimated Time</p>
              <p className="text-xl font-semibold">{bid.estimatedTime}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Proposal</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{bid.proposal}</p>
          </div>

          {bid.bidMedia && bid.bidMedia.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Supporting Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bid.bidMedia.map((media, index) => (
                  <div
                    key={index}
                    onClick={() => handleFileClick(media)}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {getMediaIcon(media.type)}
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{media.name}</p>
                      <p className="text-sm text-gray-500">
                        {(media.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bid.status === 'pending' && (
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleRejectBid}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                Reject Proposal
              </button>
              <button
                onClick={handleAcceptBid}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Accept Proposal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidDetails; 