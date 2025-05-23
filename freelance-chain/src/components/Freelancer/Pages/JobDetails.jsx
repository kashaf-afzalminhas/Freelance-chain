import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import BidForm from './BidForm';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Status badge styles based on status
  const getStatusStyle = (status) => {
    switch(status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#6D9773]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-[#0C3B2E] text-2xl font-semibold mb-2">Something went wrong</div>
        <div className="text-red-500 text-lg">{error}</div>
        <Link to="/jobs" className="mt-6 bg-[#6D9773] hover:bg-opacity-90 text-white px-6 py-2 rounded-lg shadow-md transition-all">
          Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-[#0C3B2E] text-2xl font-semibold">Job not found</div>
        <Link to="/jobs" className="mt-6 bg-[#6D9773] hover:bg-opacity-90 text-white px-6 py-2 rounded-lg shadow-md transition-all">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/jobs" className="text-[#6D9773] hover:text-[#0C3B2E] text-sm font-medium transition-colors">
                Jobs
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-500 truncate max-w-xs">
                {job.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Job Header Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold text-[#0C3B2E]">{job.title}</h1>
              <span className={`mt-2 md:mt-0 px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${getStatusStyle(job.status)}`}>
                <span className={`w-2 h-2 rounded-full mr-1.5 ${job.status === 'active' ? 'bg-emerald-500' : job.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(job.createdAt)}
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.duration}
              </div>
              <div className="flex items-center font-medium text-[#BB8A52]">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${Number(job.budget).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description Section - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#0C3B2E] border-b border-gray-200 pb-4 mb-6">Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
              
              {/* Skills Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-[#0C3B2E] mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-[#6D9773] bg-opacity-10 text-[#0C3B2E] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bid Form Section */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#0C3B2E]">Submit a Proposal</h2>
                <button 
                  onClick={() => setShowBidForm(!showBidForm)}
                  className="flex items-center justify-center px-4 py-2 rounded-md bg-[#6D9773] text-white hover:bg-opacity-90 transition-all font-medium"
                >
                  {showBidForm ? (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hide Form
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Place a Bid
                    </>
                  )}
                </button>
              </div>
              
              {showBidForm ? (
                <BidForm jobId={id} />
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Ready to submit your proposal?</h3>
                  <p className="mt-2 text-gray-500">Click the button above to place your bid and get started.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Details Sidebar - 1/3 width on large screens */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#0C3B2E] border-b border-gray-200 pb-4 mb-6">Job Details</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Budget</h3>
                  <p className="mt-2 text-2xl font-bold text-[#BB8A52]">${Number(job.budget).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</h3>
                  <p className="mt-2 text-lg font-medium text-gray-900 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#FFBA00] mr-2"></span>
                    {job.duration}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Posted On</h3>
                  <p className="mt-2 text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</h3>
                  <p className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(job.status)}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${
                      job.status === 'active' ? 'bg-emerald-500' : 
                      job.status === 'completed' ? 'bg-blue-500' : 
                      'bg-amber-500'
                    }`}></span>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </p>
                </div>
              </div>
              
              {/* Call to Action Buttons */}
              <div className="mt-8">
                <button 
                  onClick={() => setShowBidForm(true)}
                  className="w-full py-3 px-4 bg-[#FFBA00] hover:bg-opacity-90 text-[#0C3B2E] rounded-lg shadow-md font-bold transition-all flex items-center justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Proposal
                </button>
                <button className="w-full mt-3 py-3 px-4 bg-white border border-[#6D9773] text-[#6D9773] hover:bg-gray-50 rounded-lg font-bold transition-all flex items-center justify-center">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save Job
                </button>
              </div>
            </div>
            
            {/* Client Info Card */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-lg font-bold text-[#0C3B2E] mb-4">About the Client</h2>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-[#6D9773] flex items-center justify-center text-white font-bold text-lg">
                  {job.clientName?.charAt(0) || 'C'}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{job.clientName || 'Client'}</h3>
                  <p className="text-gray-500">Project Owner</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-600">Verified Payment Method</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-600">15 Jobs Posted</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-600">90% Hire Rate</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link 
                  to={`/profile/public/${job.clientId}`}
                  className="w-full py-2 px-4 bg-[#6D9773] hover:bg-opacity-90 text-white rounded-lg shadow-sm font-medium transition-all flex items-center justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>
                <Link 
                  to={`/messages/new?userId=${job.clientId}&jobId=${job._id}`}
                  className="w-full py-2 px-4 bg-white border border-[#6D9773] text-[#6D9773] hover:bg-gray-50 rounded-lg font-medium transition-all flex items-center justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message
                </Link>
              </div>
            </div>
            
            {/* Similar Jobs Card */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-lg font-bold text-[#0C3B2E] mb-4">Similar Jobs</h2>
              <div className="space-y-4">
                <Link to="#" className="block group">
                  <div className="p-3 rounded-lg border border-gray-200 group-hover:border-[#6D9773] transition-all">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#0C3B2E] transition-colors">Web Developer Needed for E-commerce Project</h3>
                    <p className="text-sm text-gray-500 mt-1">$2,500 - 3 weeks</p>
                  </div>
                </Link>
                <Link to="#" className="block group">
                  <div className="p-3 rounded-lg border border-gray-200 group-hover:border-[#6D9773] transition-all">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#0C3B2E] transition-colors">React Native Mobile Application Development</h3>
                    <p className="text-sm text-gray-500 mt-1">$4,000 - 2 months</p>
                  </div>
                </Link>
                <Link to="#" className="block group">
                  <div className="p-3 rounded-lg border border-gray-200 group-hover:border-[#6D9773] transition-all">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#0C3B2E] transition-colors">Backend API Development with Node.js</h3>
                    <p className="text-sm text-gray-500 mt-1">$3,200 - 1 month</p>
                  </div>
                </Link>
              </div>
              <Link to="/jobs" className="mt-4 text-[#6D9773] hover:text-[#0C3B2E] text-sm font-medium flex items-center justify-center">
                View all similar jobs
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;