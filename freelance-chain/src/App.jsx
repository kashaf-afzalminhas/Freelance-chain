
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import './App.css'
import Header from "./assets/Components/Header";
import Footer from "./assets/Components/footer";
import Contact from "./assets/Components/contactUs";
import Projects from "./assets/Components/CreateProject";
import home from "./assets/Components/Home"
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/page" element={<Page />} /> */}
        <Route path="/contactUs" element={<Contact />} />
        <Route path="/Createproject" element={<Projects />} />
        {/* <Route path="/freelancers" element={<Freelancers />} /> */}
      </Routes>
      <Footer />
    </Router> 
  );
}

export default App;

