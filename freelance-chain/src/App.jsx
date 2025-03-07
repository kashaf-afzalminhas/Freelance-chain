
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import './App.css'
import Homepage from './components/Freelancer/Pages/Homepage'
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import RoleSelection from "./components/RoleSelection";

function App() {
  return (
    <Router>
 
      <Routes>
        <Route path="/" element={<Homepage/>} />
        {/* <Route path="/page" element={<Page />} /> */}
        <Route path="/signin" element={<SignIn/>} />
        <Route path="signup" element={<SignUp/>} />
        <Route path="role-selection" element={<RoleSelection/>} />
        {/* <Route path="/freelancers" element={<Freelancers />} /> */}
      </Routes>
   
    </Router> 
  );
}
 
export default App;

