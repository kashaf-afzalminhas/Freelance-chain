// pages/SavedJobsPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import api from '../services/api';

function SavedJobs() {
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await api.get('/jobs/saved');
        setSavedJobs(response.data);
      } catch (err) {
        setError('Failed to load saved jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchSavedJobs();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Please sign in to view your saved jobs</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Saved Jobs</h1>
      
      {savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map(job => (
            <JobCard 
              key={job._id} 
              {...job} 
              isSaved={true} 
              postedTime={new Date(job.createdAt).toLocaleDateString()}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">You haven't saved any jobs yet</p>
        </div>
      )}
    </div>
  );
}

export default SavedJobs;