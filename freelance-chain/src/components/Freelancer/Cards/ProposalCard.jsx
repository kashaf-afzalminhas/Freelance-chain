import React from 'react';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const ProposalCard = ({ proposal, onBid }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{proposal.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{proposal.description}</p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Budget: ${proposal.budget}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due: {format(new Date(proposal.deadline), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>Posted: {format(new Date(proposal.created_at), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm ${
          proposal.status === 'open' ? 'bg-green-100 text-green-800' :
          proposal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {proposal.status.replace('_', ' ').toUpperCase()}
        </span>
        
        {proposal.status === 'open' && onBid && (
          <button
            onClick={onBid}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Place Bid
          </button>
        )}
      </div>
    </div>
  );
};