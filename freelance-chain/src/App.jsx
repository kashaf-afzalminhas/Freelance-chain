
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import './App.css'
import Projects from "./Components/Freelancer/CreateProject";
import Header from "../src/Components/Header";
import Footer from "../src/Components/footer";
import Contact from "../src/Components/contactUs";
import Homepage from "../src/Components/Homepage";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";import JobListPage from "./Components/Freelancer/Pages/JobListPage";
import { BiddingPage } from "./Components/Freelancer/Pages/BiddingPage";
import { ProposalsPage } from "./Components/Freelancer/Pages/ProposalsPage";
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
        {/* <Route path="/freelancers" element={<Freelancers />} /> */}
      </Routes>
      <Footer />
    </Router>
     
     

    
  );
}

export default App;

