import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService, bidService } from '../../../services/api';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [bidsLoading, setBidsLoading] = useState({});
  const [bids, setBids] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getMyJobs(); // Changed from getJobs to getMyJobs
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobs();
  }, []);
  const fetchBidsForJob = async (jobId) => {
    setBidsLoading(prev => ({ ...prev, [jobId]: true }));
    try {
      const response = await bidService.getBidsForJob(jobId);
      setBids(prev => ({ ...prev, [jobId]: response.data }));
    } catch (err) {
      console.error(`Error fetching bids for job ${jobId}:`, err);
    } finally {
      setBidsLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleJobExpansion = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      if (!bids[jobId]) {
        fetchBidsForJob(jobId);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job => 
    filter === 'all' || job.status === filter
  );

  if (loading) {
    return <div className="text-center py-12">Loading your jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
            <p className="mt-2 text-sm text-gray-600">Manage and track your posted jobs</p>
          </div>
          <Link
            to="/create-job"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Post New Job
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex space-x-4">
            {['all', 'open', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg mb-4">No jobs found</p>
              <Link
                to="/create-job"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                      <p className="text-gray-600 mt-1">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-4">{job.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium">${job.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{job.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Required Skills</p>
                      <p className="font-medium">{job.skills?.join(', ') || 'None specified'}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => toggleJobExpansion(job._id)}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      {expandedJobId === job._id ? 'Hide Bids' : `View Bids (${bids[job._id]?.length || 0})`}
                    </button>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Job
                    </Link>
                  </div>

                  {expandedJobId === job._id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Bids Received</h3>
                      
                      {bidsLoading[job._id] ? (
                        <div className="text-center py-4">Loading bids...</div>
                      ) : (
                        bids[job._id]?.length === 0 ? (
                          <p className="text-gray-500">No bids yet</p>
                        ) : (
                          <div className="space-y-4">
                            {bids[job._id]?.map((bid) => (
                              <div key={bid._id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{bid.freelancerId?.username || 'Unknown Freelancer'}</h4>
                                    <p className="text-sm text-gray-600">{bid.proposal}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">${bid.bidAmount}</p>
                                    <p className="text-sm text-gray-500">{bid.estimatedTime}</p>
                                  </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <p className="text-sm">
                                    <span className="font-medium">Status:</span> {bid.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;