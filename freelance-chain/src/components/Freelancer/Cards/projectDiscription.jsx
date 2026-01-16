import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectDescription = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#0C3B2E] font-sans">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 py-5">
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="h-2 w-2 rounded-full bg-[#E9DFCE]"></div>
        ))}
      </div>

      <div className="flex flex-col flex-1 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Project Description</h1>
        <p className="text-sm text-[#BB8A52] mb-6">
          Explain all the details so the customer knows what they are getting
        </p>

        {/* Textarea Input */}
        <textarea
          placeholder="Enter project details here..."
          className="w-full h-40 rounded-lg border border-[#BB8A52] px-4 py-2 placeholder-[#BB8A52] focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
        ></textarea>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between px-4 md:px-10 py-5">
        <button
          onClick={() => navigate("/projectOverview")}
          className="w-28 h-10 rounded-full bg-[#BB8A52] text-white font-bold text-sm"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/projectPricing")}
          className="w-28 h-10 rounded-full bg-[#FFBA00] text-white font-bold text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProjectDescription;