import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import JobTitleForm from "../Cards/JobTitle";
import JobDescription from "../Cards/JobDisc";
import SkillSelection from "../Cards/SkillSelection";
import ExperienceLevelForm from "../Cards/JobExperience";
import BudgetForm from "../Cards/JobBudget";
import ScopeEstimator from "../Cards/scope";
import JobPostConfirmation from "../Cards/JobPostConfirm";

const JobCreationWizard = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading, error } = useContext(AuthContext);

  // Centralized state for all steps
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    levels: "",
    skills: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Check authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <a href="/signin" className="text-primary hover:underline">Please sign in again</a>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">You must be logged in to create a job</p>
          <a href="/signin" className="text-primary hover:underline">Please sign in</a>
        </div>
      </div>
    );
  }

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Validate jobData
      if (!jobData.title || !jobData.description || !jobData.budget || !jobData.duration || !jobData.levels || jobData.skills.length === 0) {
        setSubmitError("Please fill out all fields before submitting.");
        return;
      }

      // Get the auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setSubmitError("Authentication token not found. Please sign in again.");
        return;
      }

      console.log("Submitting jobData:", jobData); // Debugging: Log the jobData object
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...jobData,
          clientId: currentUser._id // Add the client ID to the job data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post job.");
      }

      const result = await response.json();
      console.log("Job created successfully:", result);
      
      // Show success message and redirect
      alert("Job posted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error posting job:", error);
      setSubmitError(error.message || "An error occurred while posting the job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Steps array
  const steps = [
    <JobTitleForm
      jobData={jobData}
      setJobData={setJobData}
      onNext={() => setCurrentStep(currentStep + 1)}
    />,
    <JobDescription
      jobData={jobData}
      setJobData={setJobData}
      onNext={() => setCurrentStep(currentStep + 1)}
    />,
    <SkillSelection
      jobData={jobData}
      setJobData={setJobData}
      onNext={() => setCurrentStep(currentStep + 1)}
    />,
    <ExperienceLevelForm
      jobData={jobData}
      setJobData={setJobData}
      onNext={() => setCurrentStep(currentStep + 1)}
    />,
    <BudgetForm
      jobData={jobData}
      setJobData={setJobData}
      onNext={() => setCurrentStep(currentStep + 1)}
    />,
    <ScopeEstimator
      jobData={jobData}
      setJobData={setJobData}
      onNext={() => setCurrentStep(currentStep + 1)}
    />,
    <JobPostConfirmation 
      jobData={jobData} 
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={submitError}
    />,
  ];

  return (
    <div>
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}
      {/* Render the current step */}
      {steps[currentStep]}
    </div>
  );
};

export default JobCreationWizard;