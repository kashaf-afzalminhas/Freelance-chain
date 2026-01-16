import React from "react";

const ScopeEstimator = ({ jobData, setJobData, onNext }) => {
  const options = [
    {
      label: "3 to 6 months",
      description: "Quick and straightforward tasks (ex. update text and images on a webpage).",
    },
    { label: "1 to 3 months", description: "Medium-sized projects requiring more effort." },
    { label: "Less than 1 month", description: "Short-term tasks with quick turnarounds." },
  ];

  const handleOptionSelect = (option) => {
    setJobData({ ...jobData, duration: option });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full max-w-md border border-gray-200">
        {/* Progress Indicator - unchanged logic */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index === 5 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header - unchanged logic */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0C3B2E] font-butler">
            Next, estimate the scope of your work.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1 font-minion">
            Consider the size of your project and the time it will take.
          </p>
        </div>

        {/* Options - unchanged logic */}
        <div className="space-y-3 sm:space-y-4">
          {options.map((option) => (
            <button
              key={option.label}
              className={`w-full p-3 sm:p-4 border rounded-lg text-left transition-colors ${
                jobData.duration === option.label
                  ? "border-[#6D9773] bg-[#F5F9F5]"
                  : "border-gray-300 hover:border-[#6D9773]"
              }`}
              onClick={() => handleOptionSelect(option.label)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`mt-0.5 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 border-2 flex justify-center items-center rounded-full ${
                    jobData.duration === option.label
                      ? "border-[#6D9773]"
                      : "border-gray-300"
                  }`}
                >
                  {jobData.duration === option.label && (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#6D9773] rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-[#0C3B2E] font-minion">
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 font-minion">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button - unchanged logic */}
        <button
          onClick={onNext}
          className="w-full bg-[#6D9773] text-white font-medium py-3 rounded-lg mt-6 hover:bg-[#5A8264] transition font-butler focus:outline-none focus:ring-2 focus:ring-[#6D9773] focus:ring-opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ScopeEstimator;