import React from "react";
import { useNavigate } from "react-router-dom";
const ProjectRequirements = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen bg-white text-[#0C3B2E] font-sans">
          {/* Step Indicator */}
          <div className="flex justify-center gap-2 py-5">
            <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
            <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
            <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
            <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
            <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="h-2 w-2 rounded-full bg-[#E9DFCE]"></div>
            ))}
          </div>
    
          <div className="flex flex-col items-center flex-1 px-4 md:px-10">
            <div className="max-w-md w-full">
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
                Project Requirements
              </h1>
    
              <form className="space-y-6">
                {/* Information Needed */}
                <div>
                  <label
                    htmlFor="client-information"
                    className="block text-sm font-medium mb-2"
                  >
                    Information needed from the client
                  </label>
                  <textarea
                    id="client-information"
                    placeholder="Enter the required information"
                    className="w-full h-24 rounded-lg border border-[#BB8A52] p-3 text-sm placeholder-[#BB8A52] focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
                  />
                </div>
    
                {/* Approach */}
                <div>
                  <label
                    htmlFor="project-approach"
                    className="block text-sm font-medium mb-2"
                  >
                    Approach towards completing the project
                  </label>
                  <textarea
                    id="project-approach"
                    placeholder="Enter your approach"
                    className="w-full h-24 rounded-lg border border-[#BB8A52] p-3 text-sm placeholder-[#BB8A52] focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
                  />
                </div>
    
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button onClick={() => navigate("/projectGallery")}
                    type="button"
                    className="w-28 h-10 rounded-full bg-[#BB8A52] text-white font-bold text-sm"
                  >
                    Go Back
                  </button>
                  <button onClick={() => navigate("/new")}
                    type="submit"
                    className="w-28 h-10 rounded-full bg-[#FFBA00] text-white font-bold text-sm"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    };
export default ProjectRequirements;
