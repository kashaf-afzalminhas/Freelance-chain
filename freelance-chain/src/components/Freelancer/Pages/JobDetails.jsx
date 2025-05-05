import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import BidForm from './BidForm';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">{job.title}</h1>
      <p className="text-gray-600">{job.description}</p>
      <p className="text-gray-600">Budget: ${job.budget}</p>
      <p className="text-gray-600">Duration: {job.duration}</p>
      <p className="text-gray-600">Skills: {job.skills.join(', ')}</p>
      <p className="text-gray-600">Status: {job.status}</p>
      <p className="text-gray-600">Posted: {format(new Date(job.createdAt), 'EEEE, MMMM do, yyyy h:mm a')}</p>
      
      <button 
        onClick={() => setShowBidForm(!showBidForm)}
        className="mt-4 bg-[#6D9773] text-white px-4 py-2 rounded-md hover:bg-[#5c8162]"
      >
        {showBidForm ? 'Hide Bid Form' : 'Place a Bid'}
      </button>

      {showBidForm && <BidForm jobId={id} />}
    </div>
  );
};

export default JobDetail;