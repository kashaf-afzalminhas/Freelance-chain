import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ProposalCard } from '../Cards/ProposalCard';

export const ProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch proposals from your backend here
  useEffect(() => {
    // Implementation will be added when we set up the backend
  }, []);

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || proposal.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Projects</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Projects</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onBid={() => {/* Implementation will be added */}}
          />
        ))}
      </div>
    </div>
  );
};