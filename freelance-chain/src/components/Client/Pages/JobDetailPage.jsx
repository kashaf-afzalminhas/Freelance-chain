// // JobDetailPage.js
// import SubmitBidForm from '../../Freelancer/Pages/SubmitBidForm';    
// import JobBidsList from './JobBidsList';

// const JobDetailPage = () => {
//   const { user } = useAuth(); // Your auth context
//   const { jobId } = useParams();
//   const [job, setJob] = useState(null);

//   // Fetch job details...

//   return (
//     <div>
//       {/* Job details rendering... */}
      
//       {user?.role === 'freelancer' && job?.status === 'open' ? (
//         <SubmitBidForm jobId={jobId} />
//       ) : user?.role === 'client' && job?.client === user.id ? (
//         <JobBidsList jobId={jobId} />
//       ) : null}
//     </div>
//   );
// };





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import BidForm from './BidForm';
import BidCard from './BidCard';
import FilterControls from './FilterControls';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'newest'
  });

  useEffect(() => {
    const fetchJobAndBids = async () => {
      try {
        // Fetch job details
        const jobResponse = await axios.get(`http://localhost:5000/jobs/${id}`);
        setJob(jobResponse.data);

        // Fetch bids with filters
        const bidsResponse = await axios.get(`http://localhost:5000/bids/job/${id}`, {
          params: filters
        });
        setBids(bidsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndBids();
  }, [id, filters]);

  const handleAcceptBid = async (bidId) => {
    try {
      await axios.put(`http://localhost:5000/bids/${bidId}`, {
        status: 'accepted'
      });
      // Refresh bids after status change
      const response = await axios.get(`http://localhost:5000/bids/job/${id}`);
      setBids(response.data);
    } catch (err) {
      setError('Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await axios.put(`http://localhost:5000/bids/${bidId}`, {
        status: 'rejected'
      });
      // Refresh bids after status change
      const response = await axios.get(`http://localhost:5000/bids/job/${id}`);
      setBids(response.data);
    } catch (err) {
      setError('Failed to reject bid');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-600 mb-4">{job.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Budget</h3>
            <p className="text-lg">${job.budget}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Duration</h3>
            <p className="text-lg">{job.duration}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Skills Required</h3>
            <p className="text-lg">{job.skills.join(', ')}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">
            Posted: {format(new Date(job.createdAt), 'EEEE, MMMM do, yyyy h:mm a')}
          </p>
          <button 
            onClick={() => setShowBidForm(!showBidForm)}
            className="bg-[#6D9773] text-white px-6 py-2 rounded-md hover:bg-[#5c8162]"
          >
            {showBidForm ? 'Hide Bid Form' : 'Place a Bid'}
          </button>
        </div>

        {showBidForm && <BidForm jobId={id} />}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Proposals ({bids.length})
          </h2>
          <FilterControls filters={filters} onChange={handleFilterChange} />
        </div>

        {bids.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No proposals yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map(bid => (
              <BidCard
                key={bid._id}
                bid={{
                  ...bid,
                  job: id,
                  jobTitle: job.title,
                  freelancer: {
                    _id: bid.freelancerId?._id || bid.freelancerId,
                    name: bid.freelancerId?.name || 'Unknown Freelancer',
                    profilePicture: bid.freelancerId?.profilePicture || '/default-avatar.png'
                  },
                  amount: bid.bidAmount,
                  timeline: bid.estimatedTime
                }}
                onAccept={() => handleAcceptBid(bid._id)}
                onReject={() => handleRejectBid(bid._id)}
                isClientView={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;