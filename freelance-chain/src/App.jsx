import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import './App.css'
import Homepage from './components/Freelancer/Pages/Homepage'
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import RoleSelection from "./components/RoleSelection";
import JobListPage from "./components/Freelancer/Pages/JobListPage";
import CreateProject from "./components/Freelancer/Pages/CreateProject";
import ProjectOverview from './components/Freelancer/Cards/projectOverview';
import ProjectDescription from "./components/Freelancer/Cards/projectDiscription";
import ProjectGallery from "./components/Freelancer/Cards/projectGallery";
import ProjectRequirements from "./components/Freelancer/Cards/projectRequirement";
import ProjectPricing from "./components/Freelancer/Cards/projectPricing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/createproject" element={<CreateProject />} />
        <Route path="/projectOverview" element={<ProjectOverview />} />
        <Route path="/projectDiscription" element={<ProjectDescription />} />
        <Route path="/projectGallery" element={<ProjectGallery />} />
        <Route path="/projectRequirement" element={<ProjectRequirements />} />
        <Route path="/projectPricing" element={<ProjectPricing />} />
      </Routes>
    </Router>
  );
}

export default App;