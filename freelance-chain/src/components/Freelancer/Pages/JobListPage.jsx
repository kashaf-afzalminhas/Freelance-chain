import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import JobCard from '../Cards/JobCard';
import Filters from '../Cards/Filter';

function JobListPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

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
              {jobs.map((job, index) => (
                <Link to={`/jobs/${job._id}`} key={index}>
                  <JobCard
                    {...job}
                    createdAt={format(new Date(job.createdAt), 'EEEE, MMMM do, yyyy h:mm a')}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobListPage;