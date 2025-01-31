
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import './App.css'
import Projects from "./Components/Freelancer/Pages/CreateProject";
import Header from "../src/Components/Header";
import Footer from "../src/Components/footer";
import Contact from "./Components/Freelancer/Pages/contactUs";
import Homepage from "../src/Components/Homepage";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import JobListPage from "./Components/Freelancer/Pages/JobListPage";
import { BiddingPage } from "./Components/Freelancer/Pages/BiddingPage";
import { ProposalsPage } from "./Components/Freelancer/Pages/ProposalsPage";
import ProjectOverview from "./Components/Freelancer/Cards/projectCreation/projectOverview";
import ProjectDiscription from "./Components/Freelancer/Cards/projectCreation/projectDiscription";
import ProjectPricing from "./Components/Freelancer/Cards/projectCreation/projectPricing";
import ProjectGallery from "./Components/Freelancer/Cards/projectCreation/projectGallery";
import ProjectRequirements from "./Components/Freelancer/Cards/projectCreation/projectRequirement";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Homepage />} />
        {/* <Route path="/page" element={<Page />} /> */}
        <Route path="/contactUs" element={<Contact />} />
        <Route path="/Createproject" element={<Projects />} />
        <Route path="/Jobs" element={<JobListPage />} />
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/bidding" element={<BiddingPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/projectOverview" element={<ProjectOverview/>}/>
        <Route path="/projectDiscription" element={<ProjectDiscription/>}/>
        <Route path="/projectPricing" element={<ProjectPricing/>}/>
        <Route path="/projectGallery" element={<ProjectGallery/>}/>
        <Route path="/projectRequirement" element={<ProjectRequirements/>}/>
        {/* <Route path="/freelancers" element={<Freelancers />} /> */}
      </Routes>
      <Footer />
    </Router> 
  );
}
 
export default App;

