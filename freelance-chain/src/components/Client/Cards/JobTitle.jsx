import React from "react";

const JobTitleForm = ({ jobData, setJobData, onNext }) => {
  const handleChange = (e) => {
    setJobData({ ...jobData, title: e.target.value });
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
                  index === 0 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-[#0C3B2E] text-center">
          Let's start with a strong title.
        </h2>
        <p className="text-gray-600 mt-2 text-center text-sm md:text-base">
          This helps your job post stand out to the right candidates. It’s the first thing they’ll see, so make it count.
        </p>

        {/* Input Field */}
        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Write a title for your job post
          </label>
          <input
            type="text"
            value={jobData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D9773] transition"
            placeholder="e.g. Frontend Developer for React App"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => onNext()}
            className="bg-[#6D9773] text-white py-2 px-6 rounded-lg font-semibold text-lg shadow-md hover:bg-[#5A8663] transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobTitleForm;