import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SkillSelection = ({ jobData, setJobData, onNext }) => {
  const [inputValue, setInputValue] = useState("");

  const popularSkills = [
    "Graphic Design", 
    "UI/UX Design", 
    "Adobe Photoshop", 
    "Figma", 
    "Illustration",
    "Web Design",
    "Brand Identity",
    "Prototyping"
  ];

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !jobData.skills.includes(trimmedSkill)) {
      setJobData({ ...jobData, skills: [...jobData.skills, trimmedSkill] });
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addSkill(inputValue);
    }
  };

  const removeSkill = (skill) => {
    setJobData({ ...jobData, skills: jobData.skills.filter((s) => s !== skill) });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-md md:max-w-lg lg:max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index === 2 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0C3B2E] font-butler">
          What are the main skills required?
        </h2>

        {/* Search Input */}
        <div className="mt-4 sm:mt-6 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills or add your own"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 sm:py-3 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D9773] font-minion text-sm sm:text-base"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-minion">
            Press enter to add a custom skill
          </p>
        </div>

        {/* Selected Skills */}
        {jobData.skills.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2 font-minion">
              Selected Skills ({jobData.skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobData.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-[#BB8A52] text-white px-3 py-1 rounded-full"
                >
                  <span className="text-xs sm:text-sm font-minion">{skill}</span>
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="ml-2 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Skills */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 font-minion">
            Popular Design Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => addSkill(skill)}
                className="px-3 py-1 border border-[#BB8A52] text-[#0C3B2E] rounded-full text-xs sm:text-sm hover:bg-[#BB8A52] hover:text-white transition-colors font-minion focus:outline-none focus:ring-2 focus:ring-[#6D9773] focus:ring-opacity-50"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={onNext}
            disabled={jobData.skills.length === 0}
            className={`w-full sm:w-auto py-2 px-6 rounded-lg font-semibold text-base sm:text-lg shadow-md transition font-butler focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              jobData.skills.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#6D9773] hover:bg-[#5A8663] text-white focus:ring-[#6D9773] active:bg-[#0C3B2E]'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillSelection;