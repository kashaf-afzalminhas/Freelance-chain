import React, { useState } from 'react';

// Sample job data
const jobs = [
  { title: 'Job Title 1', location: 'Location 1', posted: '1 hour ago', rating: 4, budget: '$500', hours: '20', date: '2023-10-01' },
  { title: 'Job Title 2', location: 'Location 2', posted: '2 days ago', rating: 5, budget: '$300', hours: '10', date: '2023-09-29' },
  { title: 'Job Title 3', location: 'Location 3', posted: '1 week ago', rating: 3, budget: '$700', hours: '30', date: '2023-09-25' },
];

const JobListings = () => {
  const [filters, setFilters] = useState({
    skill: '',
    hours: '',
    budget: '',
    date: '',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex">
      {/* Filter Section */}
      <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <div className="mb-4">
          <label className="block mb-1">Skill</label>
          <select
            name="skill"
            value={filters.skill}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Skill</option>
            <option value="web-development">Web Development</option>
            <option value="graphic-design">Graphic Design</option>
            <option value="content-writing">Content Writing</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Hours</label>
          <select
            name="hours"
            value={filters.hours}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Hours</option>
            <option value="10">Less than 10</option>
            <option value="20">10-20</option>
            <option value="30">20-30</option>
            <option value="40">More than 30</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Budget</label>
          <select
            name="budget"
            value={filters.budget}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Budget</option>
            <option value="$100">$100</option>
            <option value="$300">$300</option>
            <option value="$500">$500</option>
            <option value="$1000">$1000</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Date</label>
          <select
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Date</option>
            <option value="today">Today</option>
            <option value="last-3-days">Last 3 Days</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
        {jobs.map((job, index) => (
          <div key={index} className="bg-white rounded-lg p-4 mb-4 shadow-md">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.location} | {job.posted}</p>
            <p className="text-gray-800">Budget: {job.budget} | Hours: {job.hours}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">{'★'.repeat(job.rating)}</span>
              <span className="text-gray-500 ml-2">Rating: {job.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListings;