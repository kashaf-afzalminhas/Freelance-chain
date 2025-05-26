import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTitleForm from "../Cards/JobTitle";
import JobDescription from "../Cards/JobDisc";
import SkillSelection from "../Cards/SkillSelection";
import ExperienceLevelForm from "../Cards/JobExperience";
import BudgetForm from "../Cards/JobBudget";
import ScopeEstimator from "../Cards/scope";
import JobPostConfirmation from "../Cards/JobPostConfirm";
import { jobService } from '../../../services/api';

const JobCreationWizard = () => {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    levels: "",
    skills: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    try {
      // Validate jobData
      if (!jobData.title || !jobData.description || !jobData.budget || 
          !jobData.duration || !jobData.levels || jobData.skills.length === 0) {
        setError("Please fill out all fields before submitting.");
        return;
      }

      setError(null);
      const response = await jobService.createJob(jobData);
      
      if (response.success) {
        navigate("/my-jobs");
      } else {
        setError(response.message || "Failed to post job");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      setError(err.message || "Failed to post job");
    }
  };

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
      error={error}
    />,
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {steps[currentStep]}
    </div>
  );
};

export default JobCreationWizard;