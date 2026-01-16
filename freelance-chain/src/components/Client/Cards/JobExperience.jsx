import React from "react";

const ExperienceLevelForm = ({ jobData, setJobData, onNext }) => {
  const levels = [
    { value: "Entry Level", description: "0-2 years of experience" },
    { value: "Intermediate", description: "2-5 years of experience" },
    { value: "Experienced", description: "5-8 years of experience" },
    { value: "Expert", description: "8+ years of experience" }
  ];

  const handleChange = (level) => {
    setJobData({ ...jobData, levels: level });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index === 3 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0C3B2E] font-butler">
            What is the required experience level?
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base font-minion">
            Select the experience level suitable for this job post.
          </p>
        </div>

        {/* Experience Level Options */}
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          {levels.map((level) => (
            <label
              key={level.value}
              className={`flex items-start px-4 py-3 sm:py-4 rounded-lg border transition-colors cursor-pointer ${
                jobData.levels === level.value
                  ? "border-[#0C3B2E] bg-[#F5F3EF]"
                  : "border-gray-300 hover:border-[#6D9773]"
              }`}
            >
              <input
                type="radio"
                name="experience"
                value={level.value}
                checked={jobData.levels === level.value}
                onChange={() => handleChange(level.value)}
                className="mt-1 accent-[#0C3B2E] w-4 h-4 sm:w-5 sm:h-5 mr-3 flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-gray-800 text-sm sm:text-base font-medium font-minion">
                  {level.value}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm font-minion">
                  {level.description}
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onNext}
            disabled={!jobData.levels}
            className={`w-full sm:w-auto py-2 px-6 rounded-lg font-semibold text-base sm:text-lg shadow-md transition font-butler focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              !jobData.levels
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

export default ExperienceLevelForm;
