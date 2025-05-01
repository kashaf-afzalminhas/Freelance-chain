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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-200">
      <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4,5,6,7].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === 5 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <h2 className="text-lg font-semibold text-[#0C3B2E]">
          Next, estimate the scope of your work.
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Consider the size of your project and the time it will take.
        </p>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.label}
              className={`w-full p-4 border rounded-lg text-left ${
                jobData.duration === option.label
                  ? "border-[#6D9773] bg-[#6D977310]"
                  : "border-gray-300"
              }`}
              onClick={() => handleOptionSelect(option.label)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 border-2 flex justify-center items-center rounded-full ${
                    jobData.duration === option.label
                      ? "border-[#6D9773]"
                      : "border-gray-300"
                  }`}
                >
                  {jobData.duration === option.label && (
                    <div className="w-3 h-3 bg-[#6D9773] rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="text-[#0C3B2E] font-medium">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-gray-500">{option.description}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={onNext}
          className="w-full bg-[#6D9773] text-white font-medium py-3 rounded-lg mt-6 hover:bg-[#5A8264]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ScopeEstimator;