import React from "react";
import { useNavigate } from "react-router-dom";

const pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#0C3B2E] font-sans">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 py-5">
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-2 w-2 rounded-full bg-[#E9DFCE]"></div>
        ))}
      </div>

      <div className="flex flex-col flex-1 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Project Pricing</h1>
        <p className="text-sm text-[#BB8A52] mb-6">Step 3 of the process</p>

        {/* Price Input */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Price</label>
          <input
            type="text"
            placeholder="Set your rate!"
            className="w-full h-12 rounded-lg border border-[#BB8A52] px-4 placeholder-[#BB8A52] focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
          />
        </div>

        {/* Delivery Days Input */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Delivery Days</label>
          <input
            type="text"
            placeholder="Enter delivery days"
            className="w-full h-12 rounded-lg border border-[#BB8A52] px-4 placeholder-[#BB8A52] focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
          />
        </div>

        {/* Extras */}
        <div className="space-y-3">
          {["1 on 1 Call", "Urgent Delivery", "Extra Revisions"].map(
            (option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg border-[#BB8A52]"
              >
                <input
                  type="radio"
                  name="extras"
                  className="h-5 w-5 text-[#6D9773] focus:ring-0"
                />
                <span className="text-sm">{option}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between px-4 md:px-10 py-5">
        <button
          onClick={() => navigate("/projectDiscription")}
          className="w-28 h-10 rounded-full bg-[#BB8A52] text-white font-bold text-sm"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/projectGallery")}
          className="w-28 h-10 rounded-full bg-[#FFBA00] text-white font-bold text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default pricing;