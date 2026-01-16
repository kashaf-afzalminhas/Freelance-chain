import React from "react";

const JobDescription = ({ jobData, setJobData, onNext }) => {
  const handleChange = (e) => {
    setJobData({ ...jobData, description: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-md md:max-w-lg lg:max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index === 1 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0C3B2E] font-butler">
            Start the conversation.
          </h2>
          <ul className="text-gray-600 mt-2 text-sm sm:text-base md:text-lg text-left font-minion list-disc pl-5 space-y-1">
            <li>Talent are looking for:</li>
            <li className="ml-4">Clear expectations about your task or deliverables</li>
            <li className="ml-4">The skills required for your work</li>
            <li className="ml-4">Good communication</li>
            <li className="ml-4">Details about how you or your team like to work</li>
          </ul>
        </div>

        {/* Description Input */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 font-minion">
            Describe what you need
          </label>
          <textarea
            rows={6}
            maxLength={30000}
            value={jobData.description}
            onChange={handleChange}
            placeholder="Already have a description? Paste it here!\n\nExample:\nBudget: 500-800 VG\nTimeline: 1-2 weeks\nRequired Skills: React, Node.js, Blockchain Development"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base placeholder-[#BB8A52] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6D9773] font-minion transition-colors"
          ></textarea>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-minion">
            30,000 characters max
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onNext}
            className="w-full sm:w-auto bg-[#6D9773] hover:bg-[#5A8663] text-white py-2 px-6 rounded-lg font-semibold text-base sm:text-lg shadow-md transition font-butler focus:outline-none focus:ring-2 focus:ring-[#6D9773] focus:ring-opacity-50 active:bg-[#0C3B2E]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;

