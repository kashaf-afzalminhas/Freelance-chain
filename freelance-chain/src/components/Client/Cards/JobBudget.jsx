import React, { useState, useEffect } from "react";

const BudgetForm = ({ jobData, setJobData, onNext }) => {
  const [minRate, setMinRate] = useState(0.1); // Minimum hourly rate in ETH
  const [maxRate, setMaxRate] = useState(0.5); // Maximum hourly rate in ETH
  const [isFixedPrice, setIsFixedPrice] = useState(false);
  const [fixedBudget, setFixedBudget] = useState("");

  // Validate ETH input (only numbers and decimals)
  const handleFixedBudgetChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFixedBudget(value);
    }
  };

  // Update jobData whenever the budget changes
  useEffect(() => {
    if (isFixedPrice) {
      setJobData({ ...jobData, budget: fixedBudget });
    } else {
      setJobData({ ...jobData, budget: `${minRate} - ${maxRate} ETH/hour` });
    }
  }, [minRate, maxRate, fixedBudget, isFixedPrice]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
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
          Set your project budget in ETH
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          This helps us match you with blockchain talent in your range.
        </p>

        {/* Toggle Buttons */}
        <div className="flex mt-6 border border-gray-300 rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-3 font-semibold transition ${
              !isFixedPrice ? "text-white bg-[#6D9773]" : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setIsFixedPrice(false)}
          >
            Hourly rate
          </button>
          <button
            className={`flex-1 py-3 font-semibold transition ${
              isFixedPrice ? "text-white bg-[#6D9773]" : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setIsFixedPrice(true)}
          >
            Fixed price
          </button>
        </div>

        {/* Hourly Rate Range or Fixed Price Input */}
        {!isFixedPrice ? (
          <div className="mt-8">
            <p className="text-gray-700 font-semibold">Hourly Rate Range (ETH)</p>
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Minimum Rate: Ξ{minRate.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.01"
                value={minRate}
                onChange={(e) => setMinRate(Number(e.target.value))}
                className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6D9773]"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm text-gray-600">Maximum Rate: Ξ{maxRate.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.01"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6D9773]"
              />
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-gray-700 font-semibold">Fixed Budget (ETH)</p>
            <div className="relative mt-2">
              <span className="absolute left-3 top-3 text-gray-500">Ξ</span>
              <input
                type="text"
                value={fixedBudget}
                onChange={handleFixedBudgetChange}
                placeholder="0.10"
                className="w-full pl-8 mt-2 p-3 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
              />
            </div>
          </div>
        )}

        {/* Info Text */}
        <p className="text-gray-600 text-sm mt-6">
          This is the average rate for similar projects. Professionals typically charge{" "}
          <strong className="text-[#0C3B2E]">
            {isFixedPrice
              ? fixedBudget ? `Ξ${fixedBudget}` : 'Ξ0.10 - Ξ1.00'
              : `Ξ${minRate.toFixed(2)} - Ξ${maxRate.toFixed(2)}/hour`}
          </strong>{" "}
          for smart contract development and similar work. Rates may vary.
        </p>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onNext}
            disabled={isFixedPrice && !fixedBudget}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-lg shadow-md transition ${
              isFixedPrice && !fixedBudget
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#6D9773] hover:bg-[#5A8663] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;