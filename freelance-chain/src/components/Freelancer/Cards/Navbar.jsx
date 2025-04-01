import React, { useState } from "react";

const Navbar = () => {
  const [findWorkOpen, setFindWorkOpen] = useState(false);
  const [deliverProjectsOpen, setDeliverProjectsOpen] = useState(false);
 

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
            <a
              href="/jobs"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Browse Jobs
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Proposals & Offers
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Saved Jobs
            </a>
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
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              Active Projects
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
            >
              History
            </a>
          </div>
        )}
      </div>
      
      {/* My Projects Dropdown */}
      <a
        href="/createproject"
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