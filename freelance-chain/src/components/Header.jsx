import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi";

const Header = () => {
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);

  const toggleWorkDropdown = () => {
    setWorkDropdownOpen(!workDropdownOpen);
    setProjectsDropdownOpen(false); // Close other dropdown
  };

  const toggleProjectsDropdown = () => {
    setProjectsDropdownOpen(!projectsDropdownOpen);
    setWorkDropdownOpen(false); // Close other dropdown
  };

  return (
    <header className="bg-[#fcfaf6] shadow-md">
      <div className="container py-5 px-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0C3B2E]">Freelance-Chain</h1>
        <nav className="space-x-6 flex justify-center items-center">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFBA00] font-semibold border-b-2 border-[#FFBA00]"
                : "text-gray-600 hover:text-[#6D9773]"
            }
          >
            Home
          </NavLink>
          <div className="relative">
            <button
              onClick={toggleWorkDropdown}
              className="text-gray-600 hover:text-[#6D9773]"
              aria-haspopup="true"
              aria-expanded={workDropdownOpen}
            >
              Find work
            </button>
            {workDropdownOpen && (
              <div className="absolute bg-white w-40 shadow-lg border rounded-md mt-2 z-10">
                <NavLink to="/jobs" className="block px-4 py-2 hover:bg-[#f0f0f0]">
                  Find work
                </NavLink>
                <NavLink to="/bidding" className="block px-4 py-2 hover:bg-[#f0f0f0]">
                  Saved jobs
                </NavLink>
                <NavLink to="/proposals" className="block px-4 py-2 hover:bg-[#f0f0f0]">
                  Proposals and offers
                </NavLink>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={toggleProjectsDropdown}
              className="text-gray-600 hover:text-[#6D9773]"
              aria-haspopup="true"
              aria-expanded={projectsDropdownOpen}
            >
              Projects
            </button>
            {projectsDropdownOpen && (
              <div className="absolute bg-white w-40 shadow-lg border rounded-md mt-2 z-10">
                <NavLink to="/my-projects" className="block px-4 py-2 hover:bg-[#f0f0f0]">
                  My Projects
                </NavLink>
                <NavLink to="/contracts-history" className="block px-4 py-2 hover:bg-[#f0f0f0]">
                  Contracts History
                </NavLink>
                <NavLink to="/current-contracts" className="block px-4 py-2 hover:bg-[#f0f0f0]">
                  Current Contracts
                </NavLink>
              </div>
            )}
          </div>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFBA00] font-semibold border-b-2 border-[#FFBA00]"
                : "text-gray-600 hover:text-[#6D9773]"
            }
          >
            Messages
          </NavLink>
          <NavLink
            to="/contactUs"
            className={({ isActive }) =>
              isActive
                ? "text-[#FFBA00] font-semibold border-b-2 border-[#FFBA00]"
                : "text-gray-600 hover:text-[#6D9773]"
            }
          >
            Contact Us
          </NavLink>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs, projects..."
              className="border border-gray-300 rounded-md pl-10 pr-4 py-2"
            />
            <AiOutlineSearch className="absolute left-2 top-2 mt-1 text-gray-400" />
          </div>
          <button className="text-gray-600">
            <AiOutlineBell size={24} />
          </button>
          <NavLink to="/profile" className="text-gray-600">
            <HiOutlineUserCircle size={24} />
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;