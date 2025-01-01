import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-[#0C3B2E]">Freelance-Chain</h1>
        <nav className="space-x-6">
          <NavLink
           to="/home" className={({isActive})=>
            isActive
           ? "text-[#FFBA00] font-semibold border-b-2 border-[#FFBA00]" :
           "text-gray-600 hover:text-[#6D9773]"
        }
          >
            Home
          </NavLink>
          {/* <Link to="/page" className="text-gray-600 hover:text-[#6D9773]">
            Page
          </Link> */}
          <NavLink
            to="/contactUs"
            className={({isActive})=> isActive
            ? "text-[#FFBA00] font-semibold border-b-2 border-[#FFBA00]"
            :"text-gray-600 hover:text-[#6D9773]"

        }
          >
            Contact
          </NavLink>
          <NavLink to="/Createproject" className={({isActive})=>isActive ? "text-[#FFBA00] font-semibold border-b-2 border-[#FFBA00]"
          : "text-gray-600 hover:text-[#6D9773]"
          }>
            Projects
          </NavLink>
          {/* <Link to="/freelancers" className="text-gray-600 hover:text-[#6D9773]">
            Freelancers
          </Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
