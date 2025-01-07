
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import './App.css'
import Header from "./assets/Components/Header";
import Footer from "./assets/Components/footer";
import Contact from "./assets/Components/contactUs";
import Projects from "./assets/Components/CreateProject";
import home from "./assets/Components/Home";
import ProjectOverview from "./assets/Components/projectCreation/projectOverview";
import ProjectDiscription from "./assets/Components/projectCreation/projectDiscription"
import ProjectPricing from "./assets/Components/projectCreation/projectPricing"
import ProjectGallery from "./assets/Components/projectCreation/projectGallery";
import ProjectRequirements from "./assets/Components/projectCreation/projectRequirement";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<home />} />
        {/* <Route path="/page" element={<Page />} /> */}
        <Route path="/contactUs" element={<Contact />} />
        <Route path="/Createproject" element={<Projects />} />
        <Route path="/projectOverview" element={<ProjectOverview />}/>
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

