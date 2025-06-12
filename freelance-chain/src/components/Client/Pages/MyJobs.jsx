import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService, bidService } from '../../../services/api';
import { contractService } from '../../../services/ContractService'; // Make sure the filename matches exactly
import { toast } from 'react-hot-toast';
import { FileText } from 'lucide-react';
import { useContracts } from '../../../context/ContractContext';
import { createContractOnChain } from '../../../services/ContractOnChainService';
import { useWeb3 } from '../../../context/Web3Context';
import axios from 'axios';
import { ethers } from 'ethers';

// Assuming API_URL is defined elsewhere or imported
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

const MyJobs = () => {
  const { fetchContracts } = useContracts();
  const { isConnected, connectWallet, account, provider, signer } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [bids, setBids] = useState({});
  const [acceptingBid, setAcceptingBid] = useState(false);
  const [editJob, setEditJob] = useState(null);
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
      console.log('Fetched bids for job:', jobId, response.data);
      setBids(prev => ({ ...prev, [jobId]: response.data }));
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  };

  const handleAcceptBid = async (bid) => {
    try {
      if (!isConnected) {
        await connectWallet();
      }
      if (!provider || !signer) {
        throw new Error("Connect wallet first");
      }

      const currentAddress = await signer.getAddress();
      if (currentAddress.toLowerCase() === bid.freelancerAddress?.toLowerCase()) {
        throw new Error("Cannot accept your own bid");
      }

      setAcceptingBid(true);

      // Prepare contract data
      const contractData = {
        freelancerAddress: bid.freelancerAddress,
        bidAmount: bid.bidAmount,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        jobTitle: bid.job?.title || bid.jobTitle || bid.jobId?.title || "Job Contract",
        jobDescription: bid.job?.description || bid.proposal || "Job Description",
        provider: provider,
        signer: signer
      };

      console.log('Creating contract with params:', contractData);

      console.log('Parameters passed to createContractOnChain:', {
        freelancerAddress: contractData.freelancerAddress,
        bidAmount: contractData.bidAmount,
        deadline: contractData.deadline,
        jobTitle: contractData.jobTitle,
        jobDescription: contractData.jobDescription
      });

      // Create on blockchain
      const blockchainResult = await createContractOnChain(contractData);

      console.log('Blockchain contract created:', blockchainResult);

      // Save to backend - using the contractService function
      const backendContract = await contractService.createContract(
        bid.jobId,
        bid._id,
        bid.freelancerId,
        bid.freelancerAddress,
        bid.bidAmount,
        contractData.jobTitle,
        contractData.jobDescription,
        contractData.deadline,
        provider,
        signer
      );

      console.log('Backend contract created:', backendContract);

      // Update bid status
      await bidService.updateBidStatus(bid._id, {
        status: 'accepted'
      });

      toast.success('Bid accepted and contract created successfully!');

      // Refresh the bids list for this job
      fetchBids(bid.jobId);

      // Navigate to the new contract page
      navigate(`/contracts/${backendContract._id}`);

    } catch (error) {
      console.error('Error accepting bid:', error);
      toast.error(error.message || 'Failed to accept bid and create contract');
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

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This cannot be undone.')) return;
    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs => jobs.filter(j => j._id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete job');
    }
  };

  const handleJobSave = (updatedJob) => {
    setJobs(jobs => jobs.map(j => j._id === updatedJob._id ? updatedJob : j));
    setEditJob(null);
  };

  const handleEditClick = (job) => {
    console.log('Edit button clicked for job:', job);
    setEditJob(job);
  };

  const handleFileClick = (file) => {
    // Construct the full URL using the API base URL
    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';
    const fileUrl = `${baseUrl}${file.url}`;
    
    console.log('Opening file from MyJobs:', {
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
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium">
                      Active
                    </span>
                    
                  </div>
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
                        Show Bids ({bids[job._id] ? bids[job._id].length : '...' })
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
                      Proposals Received ({bids[job._id] ? bids[job._id].length : '...'})
                    </h3>
                    
                    {!bids[job._id] ? (
                      <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : bids[job._id]?.length > 0 ? (
                      <div className="space-y-4">
                        {bids[job._id].map(bid => {
                          console.log('Rendering bid:', bid);
                          return (
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
                                {bid.bidMedia && bid.bidMedia.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="font-semibold text-sm mb-2">Supporting Documents:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {bid.bidMedia.map((media, idx) => (
                                        <div
                                          key={idx}
                                          onClick={() => handleFileClick(media)}
                                          className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs cursor-pointer"
                                        >
                                          {media.type === 'image' ? (
                                             <img
                                               src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${media.url}`}
                                               alt={media.name}
                                               className="h-5 w-5 object-cover rounded mr-1"
                                              />
                                          ) : (
                                            <FileText className="h-4 w-4 mr-1" />
                                          )}
                                          <span className="mr-1">{media.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-wrap justify-end space-x-3">
                                  <Link
                                    to={`/bids/${bid._id}`}
                                    className="px-4 py-2 rounded-md font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    View Bid
                                  </Link>
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
                                    onClick={() => handleAcceptBid(bid)}
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
                          );
                        })}
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(job)} 
                    className="p-2 text-yellow-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                    title="Edit Job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteJob(job._id)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                    title="Delete Job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editJob && (
        <EditJobModal
          job={editJob}
          onClose={() => setEditJob(null)}
          onSave={handleJobSave}
        />
      )}
    </div>
  );
};

function EditJobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job.title,
    description: job.description,
    budget: job.budget,
    duration: job.duration,
  });
  const [loading, setLoading] = useState(false);

  // Add console log to verify modal is being rendered
  console.log('EditJobModal rendered with job:', job);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await jobService.updateJob(job._id, form);
      onSave(updated.data);
      toast.success('Job updated successfully!');
    } catch (err) {
      console.error('Error updating job:', err);
      toast.error(err.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary" 
              required 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary" 
              rows={4} 
              required 
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">Budget</label>
              <input 
                name="budget" 
                type="number" 
                value={form.budget} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary" 
                required 
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">Duration</label>
              <select 
                name="duration" 
                value={form.duration} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary" 
                required
              >
                <option value="">Select Duration</option>
                <option value="3 to 6 months">3 to 6 months</option>
                <option value="1 to 3 months">1 to 3 months</option>
                <option value="Less than 1 month">Less than 1 month</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MyJobs;