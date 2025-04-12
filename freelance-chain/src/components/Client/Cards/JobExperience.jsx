import React from "react";

const ExperienceLevelForm = ({ jobData, setJobData, onNext }) => {
  const levels = ["Entry Level", "Intermediate", "Experienced", "Expert"];

  const handleChange = (level) => {
    setJobData({ ...jobData, levels: level });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">

      <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4,5,6,7].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === 3 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-[#0C3B2E] text-center">
          What is the required experience level?
        </h2>
        <p className="text-gray-600 mt-2 text-center text-sm md:text-base">
          Select the experience level suitable for this job post.
        </p>

        {/* Radio Options */}
        <div className="mt-6 space-y-3">
          {levels.map((level) => (
            <label
              key={level}
              className={`flex items-center px-4 py-3 rounded-lg border ${
                jobData.levels === level
                  ? "border-[#0C3B2E] bg-[#F5F3EF]"
                  : "border-gray-300"
              } cursor-pointer transition`}
            >
              <input
                type="radio"
                name="experience"
                value={level}
                checked={jobData.levels === level}
                onChange={() => handleChange(level)}
                className="accent-[#0C3B2E] w-5 h-5 mr-3"
              />
              <span className="text-gray-800 text-sm">{level}</span>
            </label>
          ))}
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

export default ExperienceLevelForm;
