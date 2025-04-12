import React from "react";

const JobPostConfirmation = ({ jobData, onSubmit }) => {
  return (


    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-[#0C3B2E] text-center">
          Review and Post Your Job
        </h2>

        {/* Job Data Review */}
        <div className="mt-4 text-gray-700">
          <p>
            <strong>Title:</strong> {jobData.title || "Not provided"}
          </p>
          <p>
            <strong>Description:</strong> {jobData.description || "Not provided"}
          </p>
          <p>
            <strong>Budget:</strong> {jobData.budget || "Not provided"}
          </p>
          <p>
            <strong>Duration:</strong> {jobData.duration || "Not provided"}
          </p>
          <p>
            <strong>Experience Level:</strong> {jobData.levels || "Not provided"}
          </p>
          <p>
            <strong>Skills:</strong> {jobData.skills.length > 0 ? jobData.skills.join(", ") : "Not provided"}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onSubmit} // Call onSubmit to post the job
            className="bg-[#6D9773] text-white py-2 px-6 rounded-lg font-semibold text-lg shadow-md hover:bg-[#5A8663] transition"
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostConfirmation;