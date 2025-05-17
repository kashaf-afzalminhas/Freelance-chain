// SavedJobsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import JobCard from '../Cards/JobCard';
import { api } from '../../../services/api';

function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await api.get('/saved-jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#0C3B2E]">Loading saved jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0C3B2E]">Your Saved Jobs</h2>
          <p className="text-[#6D9773]">All jobs you've saved for later</p>
        </div>

        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id}>
                <JobCard
                  {...job}
                  createdAt={format(new Date(job.createdAt), 'EEEE, MMMM do, yyyy h:mm a')}
                />
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-[#0C3B2E]">You haven't saved any jobs yet.</p>
              <Link 
                to="/jobs" 
                className="text-[#BB8A52] hover:text-[#FFBA00] mt-2 inline-block"
              >
                Browse available jobs
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SavedJobsPage;