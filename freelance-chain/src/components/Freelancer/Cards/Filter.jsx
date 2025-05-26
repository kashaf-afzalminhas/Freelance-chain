import React, { useState, useEffect } from 'react';
import { Search, Sliders, X, Plus } from 'lucide-react';

export default function Filters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python',
    'HTML', 'CSS', 'Django', 'Flask', 'Express', 'MongoDB'
  ]);
  const [filters, setFilters] = useState({
    experienceLevel: [],
    jobType: [],
    skills: [],
    budgetRange: 'Any',
    searchTerm: ''
  });

  // Update search term in filters whenever it changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  // Update skills in filters whenever they change
  useEffect(() => {
    setFilters(prev => ({ ...prev, skills: selectedSkills }));
  }, [selectedSkills]);

  // Filter available skills based on search
  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase())
  );

  // Add a new skill to selected skills
  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput('');
    }
  };

  // Remove a skill from selected skills
  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const currentValues = [...prev[type]];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }

      return { ...prev, [type]: currentValues };
    });
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply all filters
  const applyFilters = () => {
    // Make sure searchTerm is included in the filters
    const activeFilters = {
      ...filters,
      searchTerm: searchTerm.trim()
    };
    
    // Pass the filters to the parent component
    onFilterChange(activeFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setFilters({
      experienceLevel: [],
      jobType: [],
      skills: [],
      budgetRange: 'Any',
      searchTerm: ''
    });
    
    // Also notify parent component that filters have been reset
    onFilterChange({
      experienceLevel: [],
      jobType: [],
      skills: [],
      budgetRange: 'Any',
      searchTerm: ''
    });
  };

  // Handle Enter key in search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Sliders className="w-5 h-5 mr-2" />
            Filters
          </h3>
          <button 
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset All
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Experience Level */}
          <div>
            <h4 className="font-medium mb-2">Experience Level</h4>
            {['Entry Level', 'Intermediate', 'Expert'].map((level) => (
              <label key={level} className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 mr-2"
                  checked={filters.experienceLevel.includes(level)}
                  onChange={() => handleCheckboxChange('experienceLevel', level)}
                />
                <span className="text-gray-700">{level}</span>
              </label>
            ))}
          </div>

          {/* Job Type */}
          <div>
            <h4 className="font-medium mb-2">Job Type</h4>
            {['Hourly', 'Fixed Price'].map((type) => (
              <label key={type} className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 mr-2"
                  checked={filters.jobType.includes(type)}
                  onChange={() => handleCheckboxChange('jobType', type)}
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-medium mb-2">Skills</h4>
            
            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSkills.map(skill => (
                <span 
                  key={skill} 
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            {/* Skill Search */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
              {skillInput && (
                <button 
                  onClick={() => setSkillInput('')}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Available Skills */}
            <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
              {filteredSkills.length > 0 ? (
                filteredSkills.map(skill => (
                  <div 
                    key={skill} 
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => addSkill(skill)}
                  >
                    <span>{skill}</span>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center">No matching skills</div>
              )}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <h4 className="font-medium mb-2">Budget Range</h4>
            <select 
              className="w-full p-2 border rounded-lg"
              value={filters.budgetRange}
              onChange={(e) => setFilters({...filters, budgetRange: e.target.value})}
            >
              <option value="Any">Any</option>
              <option value="$0 - $100">$0 - $100</option>
              <option value="$100 - $500">$100 - $500</option>
              <option value="$500 - $1000">$500 - $1000</option>
              <option value="$1000+">$1000+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={resetFilters}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={applyFilters}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}