import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectOverview = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const categories = [
    "Designer",
    "Developer",
    "Content Creation",
    "Blog Writing",
    "UI/UX",
    "Editor",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#0C3B2E] font-sans">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 py-5">
        <div className="h-2 w-2 rounded-full bg-[#6D9773]"></div>
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="h-2 w-2 rounded-full bg-[#E9DFCE]"></div>
        ))}
      </div>

      {/* Project Overview Section */}
      <div className="flex flex-col flex-1 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Project Overview</h1>

        {/* Project Title Input */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Project Title</label>
          <input
            type="text"
            placeholder="Include all relevant features of the project"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full h-12 rounded-lg border border-[#BB8A52] px-4 placeholder-[#BB8A52] focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {categories.map((cat, index) => (
            <label
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg border-[#BB8A52]"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={() => setCategory(cat)}
                className="h-5 w-5 text-[#6D9773] focus:ring-0"
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between px-4 md:px-10 py-5">
        <button
          onClick={() => navigate("/CreateProject")}
          className="w-28 h-10 rounded-full bg-[#F4EFE6] text-[#0C3B2E] font-bold text-sm"
        >
          Exit
        </button>
        <button
          onClick={() => navigate("/projectDiscription")}
          className="w-28 h-10 rounded-full bg-[#FFBA00] text-white font-bold text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProjectOverview;