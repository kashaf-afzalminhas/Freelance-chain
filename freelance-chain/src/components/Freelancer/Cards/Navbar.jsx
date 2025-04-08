import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [findWorkOpen, setFindWorkOpen] = useState(false);
  const [deliverProjectsOpen, setDeliverProjectsOpen] = useState(false);
  const [myProjectsOpen, setMyProjectsOpen] = useState(false);
 

  const toggleFindWork = () => {
    setFindWorkOpen(!findWorkOpen);
    setDeliverProjectsOpen(false);
    setMyProjectsOpen(false);
  };

  const toggleDeliverProjects = () => {
    setDeliverProjectsOpen(!deliverProjectsOpen);
    setFindWorkOpen(false);
    setMyProjectsOpen(false);
  };

  const toggleMyProjects = () => {
    setMyProjectsOpen(!myProjectsOpen);
    setFindWorkOpen(false);
    setDeliverProjectsOpen(false);
  };



  return (
    <nav className="flex items-center space-x-8">
      {/* Find Work Dropdown */}
      <div className="relative">
        <button
          onClick={toggleFindWork}
          className="flex items-center text-gray-700 hover:text-green-800 transition-colors font-medium"
        >
          Find Work
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-1 transition-transform ${findWorkOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {findWorkOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100">
            <Link
              to="/jobs"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Browse Jobs
            </Link>
            <Link
              to="/browse-projects"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Browse Projects
            </Link>
            <Link
              to="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Proposals & Offers
            </Link>
            <Link
              to="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Saved Jobs
            </Link>
          </div>
        )}
      </div>
      
      {/* Deliver Projects Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDeliverProjects}
          className="flex items-center text-gray-700 hover:text-green-800 transition-colors font-medium"
        >
          Deliver Projects
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-1 transition-transform ${deliverProjectsOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {deliverProjectsOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100">
            <Link
              to="/my-projects"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              My Projects
            </Link>
            <Link
              to="/my-projects"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Create Project
            </Link>
          </div>
        )}
      </div>
      
      {/* My Projects Dropdown */}
      <a
        href="/my-projects"
        className="text-gray-700 hover:text-green-800 transition-colors font-medium"
      >
        My Projects
      </a>
          
   
 
      
      {/* Messages Link */}
      <a
        href="#"
        className="text-gray-700 hover:text-green-800 transition-colors font-medium"
      >
        Messages
      </a>
    </nav>
  );
};

export default Navbar;