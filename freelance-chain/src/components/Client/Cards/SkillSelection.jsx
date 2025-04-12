import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SkillSelection = ({ jobData, setJobData, onNext }) => {
  const [inputValue, setInputValue] = useState("");

  const popularSkills = ["Graphic Design", "UI/UX Design", "Adobe Photoshop", "Figma", "Illustration"];

  const addSkill = (skill) => {
    if (!jobData.skills.includes(skill)) {
      setJobData({ ...jobData, skills: [...jobData.skills, skill] });
    }
    setInputValue("");
  };

  const removeSkill = (skill) => {
    setJobData({ ...jobData, skills: jobData.skills.filter((s) => s !== skill) });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
        
      <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4,5,6,7].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === 2 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
        {/* Header */}
        <h2 className="text-xl md:text-2xl font-bold text-[#0C3B2E]">What are the main skills required?</h2>

        {/* Search Input */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search skills or add your own"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D9773] pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
        </div>

        {/* Selected Skills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {jobData.skills.map((skill, index) => (
            <div key={index} className="flex items-center bg-[#BB8A52] text-white px-3 py-1 rounded-full">
              <span className="text-sm">{skill}</span>
              <X className="ml-2 w-4 h-4 cursor-pointer" onClick={() => removeSkill(skill)} />
            </div>
          ))}
        </div>

        {/* Popular Skills */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800">Popular skills for Design</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {popularSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => addSkill(skill)}
                className="px-3 py-1 border border-[#BB8A52] text-[#0C3B2E] rounded-full text-sm hover:bg-[#BB8A52] hover:text-white transition"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onNext}
            className="bg-[#6D9773] text-white py-2 px-6 rounded-lg font-semibold text-lg shadow-md hover:bg-[#5A8663] transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillSelection;