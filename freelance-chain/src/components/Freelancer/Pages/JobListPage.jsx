import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import JobCard from '../Cards/JobCard';
import Filters from '../Cards/Filter';
import { api } from '../../../services/api';

function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0">
            <Filters />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
              <p className="text-gray-600">Find your next opportunity from our curated list of jobs</p>
            </div>

            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs available at the moment.</p>
                </div>
              ) : (
                jobs.map((job, index) => (
                  <Link to={`/jobs/${job._id}`} key={index}>
                    <JobCard
                      {...job}
                      createdAt={format(new Date(job.createdAt), 'EEEE, MMMM do, yyyy h:mm a')}
                    />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobListPage;