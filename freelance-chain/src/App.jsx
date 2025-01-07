
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import './App.css'
import Projects from "../src/Components/CreateProject";
import Header from "../src/Components/Header";
import Footer from "../src/Components/footer";
import Contact from "../src/Components/contactUs";
import Home from "../src/Components/Homepage";
import JobListings from "./Components/Joblisting";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/page" element={<Page />} /> */}
        <Route path="/contactUs" element={<Contact />} />
        <Route path="/Createproject" element={<Projects />} />
        <Route path="/Jobs" element={<JobListings />} />
        {/* <Route path="/freelancers" element={<Freelancers />} /> */}
      </Routes>
      <Footer />
    </Router>
     
     

    
  );
}

export default App;

