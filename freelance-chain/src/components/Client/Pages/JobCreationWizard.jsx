import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTitleForm from "../Cards/JobTitle";
import JobDescription from "../Cards/JobDisc";
import SkillSelection from "../Cards/SkillSelection";
import ExperienceLevelForm from "../Cards/JobExperience";
import BudgetForm from "../Cards/JobBudget";
import ScopeEstimator from "../Cards/scope";
import JobPostConfirmation from "../Cards/JobPostConfirm";

const JobCreationWizard = () => {
  const navigate = useNavigate();

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

  const onSubmit = async () => {
    try {
      // Validate jobData
      if (!jobData.title || !jobData.description || !jobData.budget || !jobData.duration || !jobData.levels || jobData.skills.length === 0) {
        alert("Please fill out all fields before submitting.");
        return;
      }

      console.log("Submitting jobData:", jobData); // Debugging: Log the jobData object
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to post job.");
      }

      alert("Job posted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error posting job:", error);
      alert("An error occurred while posting the job.");
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
    <JobPostConfirmation jobData={jobData} onSubmit={onSubmit} />,
  ];

  return (
    <div>
      {/* Render the current step */}
      {steps[currentStep]}
    </div>
  );
};

export default JobCreationWizard;