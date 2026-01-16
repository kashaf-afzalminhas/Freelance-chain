import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectGallery = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0C3B2E] font-sans">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 py-5">
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-2 w-2 rounded-full bg-[#E9DFCE]"></div>
        ))}
      </div>

      <div className="flex flex-col flex-1 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Project Gallery</h1>
        <p className="text-sm text-[#BB8A52] mb-6">Step 4 of the process</p>

        {/* Upload Images */}
        <div className="mb-8">
          <h2 className="text-base font-medium mb-2">Project Images</h2>
          <p className="text-sm text-[#BB8A52] mb-4">Upload up to 10 images</p>
          <div className="border-2 border-dashed border-[#BB8A52] rounded-xl p-6 flex flex-col items-center gap-4">
            <p className="text-lg font-bold">Choose files to upload</p>
            <p className="text-sm text-[#BB8A52]">or drag and drop the files</p>
            <button className="bg-[#FFBA00] text-white rounded-full px-6 py-2 font-bold hover:bg-opacity-90">
              Upload
            </button>
          </div>
        </div>

        {/* Upload Videos */}
        <div>
          <h2 className="text-base font-medium mb-2">Project Videos</h2>
          <p className="text-sm text-[#BB8A52] mb-4">Upload up to 5 videos</p>
          <div className="border-2 border-dashed border-[#BB8A52] rounded-xl p-6 flex flex-col items-center gap-4">
            <p className="text-lg font-bold">Choose files to upload</p>
            <p className="text-sm text-[#BB8A52]">or drag and drop the files</p>
            <button className="bg-[#FFBA00] text-white rounded-full px-6 py-2 font-bold hover:bg-opacity-90">
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between px-4 md:px-10 py-5">
        <button onClick={() => navigate("/projectPricing")}
        className="w-28 h-10 rounded-full bg-[#BB8A52] text-white font-bold text-sm">
          Go Back
        </button>
        <button onClick={() => navigate("/projectRequirement")}
        className="w-28 h-10 rounded-full bg-[#FFBA00] text-white font-bold text-sm">
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProjectGallery;