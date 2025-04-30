import React from "react";

const JobPostConfirmation = ({ jobData, onSubmit }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-md md:max-w-lg">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0C3B2E] text-center font-butler">
          Review and Post Your Job
        </h2>

        {/* Job Data Review */}
        <div className="mt-6 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm sm:text-base text-gray-700 font-medium font-minion">
              <span className="text-[#0C3B2E] font-semibold">Title:</span> {jobData.title || "Not provided"}
            </p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm sm:text-base text-gray-700 font-medium font-minion">
              <span className="text-[#0C3B2E] font-semibold">Description:</span> {jobData.description || "Not provided"}
            </p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm sm:text-base text-gray-700 font-medium font-minion">
              <span className="text-[#0C3B2E] font-semibold">Budget:</span> {jobData.budget || "Not provided"}
            </p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm sm:text-base text-gray-700 font-medium font-minion">
              <span className="text-[#0C3B2E] font-semibold">Duration:</span> {jobData.duration || "Not provided"}
            </p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm sm:text-base text-gray-700 font-medium font-minion">
              <span className="text-[#0C3B2E] font-semibold">Experience Level:</span> {jobData.levels || "Not provided"}
            </p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <p className="text-sm sm:text-base text-gray-700 font-medium font-minion">
              <span className="text-[#0C3B2E] font-semibold">Skills:</span> {jobData.skills.length > 0 ? jobData.skills.join(", ") : "Not provided"}
            </p>
          </div>
        </div>

        {/* Post Button */}
        <div className="mt-8">
          <button
            onClick={onSubmit}
            className="w-full bg-[#6D9773] text-white py-3 px-6 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:bg-[#5A8663] transition font-butler focus:outline-none focus:ring-2 focus:ring-[#6D9773] focus:ring-opacity-50"
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostConfirmation;