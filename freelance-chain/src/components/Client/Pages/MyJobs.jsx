import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService, bidService } from '../../../services/api';
import { contractService } from '../../../services/ContractService'; // Make sure the filename matches exactly

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [bids, setBids] = useState({});
  const [acceptingBid, setAcceptingBid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getMyJobs();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const fetchBids = async (jobId) => {
    try {
      const response = await bidService.getBidsForJob(jobId);
      setBids(prev => ({ ...prev, [jobId]: response.data }));
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  };

// In MyJobs.jsx
const handleAcceptBid = async (bidId, jobId) => {
  try {
    setAcceptingBid(true);
    
    // 1. Accept bid
    await bidService.updateBidStatus(bidId, { status: 'accepted' });

    // 2. Create contract
    const bid = bids[jobId].find(b => b._id === bidId);
    const job = jobs.find(j => j._id === jobId);
    
    const contract = await contractService.createContract(
      jobId,
      bidId,
      bid.freelancer?._id || bid.freelancerId?._id,
      bid.bidAmount,
      job.title,
      job.description,
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    // 3. Refresh data
    await fetchContracts();
    await fetchBids(jobId);

    // 4. Navigate
    navigate(`/contracts/${contract._id}`);
  } catch (error) {
    console.error('Accept bid failed:', error);
    setError(error.response?.data?.message || error.message);
  } finally {
    setAcceptingBid(false);
  }
};
  const handleRejectBid = async (bidId, jobId) => {
    try {
      await bidService.updateBidStatus(bidId, { status: 'rejected' });
      fetchBids(jobId); // Refresh bids
    } catch (err) {
      console.error('Error rejecting bid:', err);
    }
  };

  const handleMessageFreelancer = (freelancerId) => {
    navigate(`/messages?userId=${freelancerId}`);
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
        <div className="flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-secondary">My Jobs</h1>
        <Link 
          to="/create-job" 
          className="px-5 py-2 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 mb-6 text-lg">You haven't posted any jobs yet</p>
          <Link 
            to="/create-job" 
            className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 inline-flex items-center transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-secondary">{job.title}</h2>
                  <span className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">{job.description}</p>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 font-medium">Budget: <span className="text-accent">${job.budget}</span></span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 font-medium">Duration: <span className="text-accent">{job.duration}</span></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => {
                      setExpandedJobId(expandedJobId === job._id ? null : job._id);
                      if (expandedJobId !== job._id && !bids[job._id]) {
                        fetchBids(job._id);
                      }
                    }}
                    className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      expandedJobId === job._id 
                        ? 'bg-secondary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {expandedJobId === job._id ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Hide Bids
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Show Bids ({bids[job._id]?.length || 0})
                      </>
                    )}
                  </button>
                </div>

                {expandedJobId === job._id && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-secondary flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Proposals Received ({bids[job._id]?.length || 0})
                    </h3>
                    
                    {!bids[job._id] ? (
                      <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : bids[job._id]?.length > 0 ? (
                      <div className="space-y-4">
                        {bids[job._id].map(bid => (
                          <div key={bid._id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <div className="p-4 bg-white border-b border-gray-200">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mr-3">
                                    {(bid.freelancer?.name?.[0] || bid.freelancerId?.name?.[0] || 'U').toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-lg">{bid.freelancer?.name || bid.freelancerId?.name || 'Unknown Freelancer'}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <span>Rating: 4.8/5</span>
                                      <span className="mx-2">•</span>
                                      <span>12 jobs completed</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-accent">${bid.bidAmount}</p>
                                  <p className="text-sm text-gray-500">{bid.estimatedTime}</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-gray-700 mb-4">{bid.proposal}</p>
                              <div className="flex flex-wrap justify-end space-x-3">
                                <button 
                                  onClick={() => handleRejectBid(bid._id, job._id)}
                                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                                    bid.status === 'rejected'
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : 'border border-red-500 text-red-500 hover:bg-red-50'
                                  }`}
                                  disabled={bid.status === 'rejected' || bid.status === 'accepted'}
                                >
                                  {bid.status === 'rejected' ? 'Rejected' : 'Decline'}
                                </button>
                                <button
                                  onClick={() => handleMessageFreelancer(bid.freelancer?._id || bid.freelancerId?._id)}
                                  className="px-4 py-2 rounded-md font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                >
                                  Message
                                </button>
                                <button 
                                  onClick={() => handleAcceptBid(bid._id, job._id)}
                                  className={`px-4 py-2 rounded-md font-medium ${
                                    bid.status === 'accepted'
                                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                      : 'bg-highlight text-white hover:bg-opacity-90'
                                  } transition-colors duration-200`}
                                  disabled={bid.status === 'accepted' || bid.status === 'rejected'}
                                >
                                  {bid.status === 'accepted' ? (
                                    <span className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                      Accepted
                                    </span>
                                  ) : 'Accept Proposal'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No proposals yet</p>
                        <p className="text-gray-400 mt-1">Check back later or share your job posting</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;