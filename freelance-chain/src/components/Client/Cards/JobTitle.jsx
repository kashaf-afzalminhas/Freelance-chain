import React from "react";

const JobTitleForm = ({ jobData, setJobData, onNext }) => {
  const handleChange = (e) => {
    setJobData({ ...jobData, title: e.target.value });
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
                  index === 0 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0C3B2E] font-butler">
            Let's start with a strong title.
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base md:text-lg font-minion">
            This helps your job post stand out to the right candidates. It's the first thing they'll see, so make it count.
          </p>
        </div>

        {/* Input Field */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-gray-700 text-sm sm:text-base font-medium mb-1 font-minion">
            Write a title for your job post
          </label>
          <input
            type="text"
            value={jobData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D9773] transition font-minion"
            placeholder="e.g. Frontend Developer for React App"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={() => onNext()}
            className="w-full sm:w-auto bg-[#6D9773] hover:bg-[#5A8663] text-white py-2 px-6 rounded-lg font-semibold text-base sm:text-lg shadow-md transition font-butler focus:outline-none focus:ring-2 focus:ring-[#6D9773] focus:ring-opacity-50 active:bg-[#0C3B2E]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobTitleForm;