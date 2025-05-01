import React from "react";

const JobDescription = ({ jobData, setJobData, onNext }) => {
  const handleChange = (e) => {
    setJobData({ ...jobData, description: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-lg w-full">

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4,5,6,7].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === 1 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-[#0C3B2E] text-center">
          Start the conversation.
        </h2>
        <p className="text-gray-600 mt-2 text-center text-sm md:text-base">
          Talent are looking for:
          <br />- Clear expectations about your task or deliverables
          <br />- The skills required for your work
          <br />- Good communication
          <br />- Details about how you or your team like to work.
        </p>

        {/* Description Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe what you need
          </label>
          <textarea
            rows={6}
            maxLength={30000}
            value={jobData.description}
            onChange={handleChange}
            placeholder="Already have a description? Paste it here!"
            className="w-full px-4 py-3 border rounded-md text-sm placeholder-[#BB8A52] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">30,000 characters max</p>
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

export default JobDescription;

