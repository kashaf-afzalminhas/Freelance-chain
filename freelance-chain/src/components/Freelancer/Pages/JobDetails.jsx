import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

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
      <p className="text-gray-600">Location: {job.location}</p>
      <p className="text-gray-600">Time: {job.time}</p>
      <p className="text-gray-600">Posted: {format(new Date(job.createdAt), 'EEEE, MMMM do, yyyy h:mm a')}</p>
      {/* Add more job details as needed */}
    </div>
  );
};

export default JobDetail;