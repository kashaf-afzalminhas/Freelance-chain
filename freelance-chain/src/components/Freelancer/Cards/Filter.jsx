import React from 'react';
import { Search, Sliders } from 'lucide-react';

export default function Filters() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Sliders className="w-5 h-5 mr-2" />
          Filters
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Experience Level</h4>
            {['Entry Level', 'Intermediate', 'Expert'].map((level) => (
              <label key={level} className="flex items-center mb-2">
                <input type="checkbox" className="rounded text-blue-600 mr-2" />
                <span className="text-gray-700">{level}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-2">Job Type</h4>
            {['Hourly', 'Fixed Price'].map((type) => (
              <label key={type} className="flex items-center mb-2">
                <input type="checkbox" className="rounded text-blue-600 mr-2" />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-2">Skills</h4>
            {['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python'].map((skill) => (
              <label key={skill} className="flex items-center mb-2">
                <input type="checkbox" className="rounded text-blue-600 mr-2" />
                <span className="text-gray-700">{skill}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-2">Budget Range</h4>
            <select className="w-full p-2 border rounded-lg">
              <option>Any</option>
              <option>$0 - $100</option>
              <option>$100 - $500</option>
              <option>$500 - $1000</option>
              <option>$1000+</option>
            </select>
          </div>
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Apply Filters
      </button>
    </div>
  );
}