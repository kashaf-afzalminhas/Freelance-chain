import React, { useState, useEffect } from "react";

const BudgetForm = ({ jobData, setJobData, onNext }) => {
  const [minRate, setMinRate] = useState(10); // Minimum hourly rate
  const [maxRate, setMaxRate] = useState(50); // Maximum hourly rate
  const [isFixedPrice, setIsFixedPrice] = useState(false);
  const [fixedBudget, setFixedBudget] = useState("");

  // Update jobData whenever the budget changes
  useEffect(() => {
    if (isFixedPrice) {
      setJobData({ ...jobData, budget: fixedBudget });
    } else {
      setJobData({ ...jobData, budget: `${minRate} - ${maxRate}/hour` });
    }
  }, [minRate, maxRate, fixedBudget, isFixedPrice]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4,5,6,7].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === 4 ? "bg-[#FFBA00]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Header */}
        <h2 className="text-xl md:text-2xl font-bold text-[#0C3B2E]">
          Tell us about your budget.
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          This will help us match you to talent within your range.
        </p>

        {/* Toggle Buttons */}
        <div className="flex mt-4 border border-gray-300 rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 font-semibold transition ${
              !isFixedPrice ? "text-white bg-[#6D9773]" : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setIsFixedPrice(false)}
          >
            Hourly rate
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition ${
              isFixedPrice ? "text-white bg-[#6D9773]" : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setIsFixedPrice(true)}
          >
            Fixed price
          </button>
        </div>

        {/* Hourly Rate Range or Fixed Price Input */}
        {!isFixedPrice ? (
          <div className="mt-6">
            <p className="text-gray-700 font-semibold">Hourly Rate Range</p>
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Minimum Rate: Ξ{minRate}</label>
              <input
                type="range"
                min="10"
                max="50"
                value={minRate}
                onChange={(e) => setMinRate(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Maximum Rate: Ξ{maxRate}</label>
              <input
                type="range"
                min="10"
                max="50"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-gray-700 font-semibold">Fixed Budget</p>
            <input
              type="text"
              value={fixedBudget}
              onChange={(e) => setFixedBudget(e.target.value)}
              placeholder="Enter your budget in Ether (Ξ)"
              className="w-full mt-2 p-3 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
            />
          </div>
        )}

        {/* Info Text */}
        <p className="text-gray-600 text-sm mt-4">
          This is the average rate for similar projects. Professionals tend to charge{" "}
          <strong>
            {isFixedPrice
              ? `Ξ${fixedBudget}`
              : `Ξ${minRate} - Ξ${maxRate}/hour`}
          </strong>{" "}
          for work similar to yours. Rates may vary.
        </p>

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

export default BudgetForm;