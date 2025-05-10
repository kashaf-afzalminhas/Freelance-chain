import React from 'react';
import { ExternalLink } from 'lucide-react';

const PortfolioLinks = ({ links = [] }) => {
  if (!links.length) {
    return (
      <div className="text-gray-500 italic text-sm">
        No portfolio links added yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-2 bg-white rounded-md border border-gray-100 hover:bg-purple-50 transition-colors"
        >
          <span className="text-purple-700 mr-2">
            <ExternalLink size={16} />
          </span>
          <span className="text-gray-800">{link.title}</span>
        </a>
      ))}
    </div>
  );
};

export default PortfolioLinks;
