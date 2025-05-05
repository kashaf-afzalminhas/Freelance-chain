// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [findWorkOpen, setFindWorkOpen] = useState(false);
//   const [deliverProjectsOpen, setDeliverProjectsOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleFindWork = () => {
//     setFindWorkOpen(!findWorkOpen);
//     setDeliverProjectsOpen(false);
//   };

//   const toggleDeliverProjects = () => {
//     setDeliverProjectsOpen(!deliverProjectsOpen);
//     setFindWorkOpen(false);
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 flex items-center">
//               <span className="text-2xl font-bold text-[#0C3B2E]">Freelance<span className="text-[#BB8A52]">Chain</span></span>
//             </div>
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//               {/* Home Link */}
//               <Link to="/" className="border-[#6D9773] text-[#0C3B2E] hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                 Home
//               </Link>

//               {/* Find Work Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={toggleFindWork}
//                   className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//                 >
//                   Find Work
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className={`h-4 w-4 ml-1 transition-transform ${findWorkOpen ? "rotate-180" : ""}`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
                
//                 {findWorkOpen && (
//                   <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100">
//                     <Link
//                       to="/jobs"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
//                     >
//                       Browse Jobs
//                     </Link>
//                     <Link
//                       to="/browse-projects"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
//                     >
//                       Browse Projects
//                     </Link>
//                     <Link
//                       to="#"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
//                     >
//                       Proposals & Offers
//                     </Link>
//                     <Link
//                       to="#"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
//                     >
//                       Saved Jobs
//                     </Link>
//                   </div>
//                 )}
//               </div>
              
//               {/* Deliver Projects Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={toggleDeliverProjects}
//                   className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//                 >
//                   Deliver Projects
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className={`h-4 w-4 ml-1 transition-transform ${deliverProjectsOpen ? "rotate-180" : ""}`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
                
//                 {deliverProjectsOpen && (
//                   <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100">
//                     <Link
//                       to="/my-projects"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
//                     >
//                       My Projects
//                     </Link>
//                     <Link
//                       to="/createproject"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
//                     >
//                       Create Project
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* My Projects Link */}
//               <Link
//                 to="/my-projects"
//                 className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//               >
//                 My Projects
//               </Link>

//               {/* Messages Link */}
//               <Link
//                 to="#"
//                 className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//               >
//                 Messages
//               </Link>

//               {/* Create Job Link */}
//               <Link
//                 to="/create-job"
//                 className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//               >
//                 Create Job
//               </Link>
//             </div>
//           </div>

//           {/* Connect Wallet Button */}
//           <div className="hidden sm:ml-6 sm:flex sm:items-center">
//             <button className="bg-[#0C3B2E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#6D9773] transition-colors">
//               Connect Wallet
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="-mr-2 flex items-center sm:hidden">
//             <button 
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               type="button" 
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6D9773]"
//             >
//               <span className="sr-only">Open main menu</span>
//               <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="sm:hidden">
//           <div className="pt-2 pb-3 space-y-1">
//             <Link
//               to="/"
//               className="bg-[#f0f7f1] border-[#6D9773] text-[#0C3B2E] block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//             >
//               Home
//             </Link>

//             <div className="pl-3 pr-4 py-2">
//               <button
//                 onClick={toggleFindWork}
//                 className="w-full text-left text-gray-500 hover:text-gray-700 text-base font-medium flex justify-between items-center"
//               >
//                 Find Work
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className={`h-4 w-4 ml-1 transition-transform ${findWorkOpen ? "rotate-180" : ""}`}
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
              
//               {findWorkOpen && (
//                 <div className="pl-4 mt-2 space-y-2">
//                   <Link
//                     to="/jobs"
//                     className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
//                   >
//                     Browse Jobs
//                   </Link>
//                   <Link
//                     to="/browse-projects"
//                     className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
//                   >
//                     Browse Projects
//                   </Link>
//                   <Link
//                     to="#"
//                     className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
//                   >
//                     Proposals & Offers
//                   </Link>
//                   <Link
//                     to="#"
//                     className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
//                   >
//                     Saved Jobs
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <div className="pl-3 pr-4 py-2">
//               <button
//                 onClick={toggleDeliverProjects}
//                 className="w-full text-left text-gray-500 hover:text-gray-700 text-base font-medium flex justify-between items-center"
//               >
//                 Deliver Projects
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className={`h-4 w-4 ml-1 transition-transform ${deliverProjectsOpen ? "rotate-180" : ""}`}
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
              
//               {deliverProjectsOpen && (
//                 <div className="pl-4 mt-2 space-y-2">
//                   <Link
//                     to="/my-projects"
//                     className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
//                   >
//                     My Projects
//                   </Link>
//                   <Link
//                     to="/createproject"
//                     className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
//                   >
//                     Create Project
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <Link
//               to="/my-projects"
//               className="text-gray-500 hover:bg-[#f0f7f1] hover:text-[#0C3B2E] block pl-3 pr-4 py-2 text-base font-medium"
//             >
//               My Projects
//             </Link>

//             <Link
//               to="#"
//               className="text-gray-500 hover:bg-[#f0f7f1] hover:text-[#0C3B2E] block pl-3 pr-4 py-2 text-base font-medium"
//             >
//               Messages
//             </Link>

//             <Link
//               to="/create-job"
//               className="text-gray-500 hover:bg-[#f0f7f1] hover:text-[#0C3B2E] block pl-3 pr-4 py-2 text-base font-medium"
//             >
//               Create Job
//             </Link>
//           </div>
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             <div className="px-4">
//               <button  onClick={() => navigate('/signin')} className="w-full bg-[#0C3B2E] text-white px-4 py-2 rounded-md text-base font-medium hover:bg-[#6D9773] transition-colors">
//                 Connect Wallet
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [findWorkOpen, setFindWorkOpen] = useState(false);
  const [deliverProjectsOpen, setDeliverProjectsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const toggleFindWork = () => {
    setFindWorkOpen(!findWorkOpen);
    setDeliverProjectsOpen(false);
  };

  const toggleDeliverProjects = () => {
    setDeliverProjectsOpen(!deliverProjectsOpen);
    setFindWorkOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/signin');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#0C3B2E]">
                Freelance<span className="text-[#BB8A52]">Chain</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Find Work Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleFindWork}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Find Work
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transition-transform ${findWorkOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {findWorkOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100">
                    <Link
                      to="/jobs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
                    >
                      Browse Jobs
                    </Link>
                    <Link
                      to="/browse-projects"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
                    >
                      Browse Projects
                    </Link>
                    <Link
                      to="my-jobs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
                    >
                      My Jobs
                    </Link>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
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
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Deliver Projects
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transition-transform ${deliverProjectsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {deliverProjectsOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100">
                    <Link
                      to="/my-projects"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
                    >
                      My Projects
                    </Link>
                    <Link
                      to="/createproject"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f7f1] hover:text-[#0C3B2E]"
                    >
                      Create Project
                    </Link>
                  </div>
                )}
              </div>

              {/* Other Links */}
              <Link
                to="/my-projects"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                My Projects
              </Link>
              <Link
                to="/messages"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Messages
              </Link>
              <Link
                to="/create-job"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Create Job
              </Link>
            </div>
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <button className="flex items-center text-sm text-green-900 hover:text-green-800">
                  <span>Hello, {user.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/signin"
                className="bg-[#0C3B2E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#6D9773] transition-colors"
              >
                Connect Wallet
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6D9773]"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* Find Work Mobile Dropdown */}
            <div className="px-4 py-2">
              <button
                onClick={toggleFindWork}
                className="w-full text-left text-gray-500 hover:text-gray-700 text-base font-medium flex justify-between items-center"
              >
                Find Work
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transition-transform ${findWorkOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {findWorkOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <Link
                    to="/jobs"
                    className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/browse-projects"
                    className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
                  >
                    Browse Projects
                  </Link>
                  <Link
                    to="my-jobs"
                    className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="#"
                    className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
                  >
                    Saved Jobs
                  </Link>
                </div>
              )}
            </div>

            {/* Deliver Projects Mobile Dropdown */}
            <div className="px-4 py-2">
              <button
                onClick={toggleDeliverProjects}
                className="w-full text-left text-gray-500 hover:text-gray-700 text-base font-medium flex justify-between items-center"
              >
                Deliver Projects
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transition-transform ${deliverProjectsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {deliverProjectsOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <Link
                    to="/my-projects"
                    className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
                  >
                    My Projects
                  </Link>
                  <Link
                    to="/createproject"
                    className="block py-2 text-sm text-gray-500 hover:text-[#0C3B2E]"
                  >
                    Create Project
                  </Link>
                </div>
              )}
            </div>

            {/* Other Mobile Links */}
            <Link
              to="/my-projects"
              className="text-gray-500 hover:bg-[#f0f7f1] hover:text-[#0C3B2E] block px-4 py-2 text-base font-medium"
            >
              My Projects
            </Link>
            <Link
              to="/messages"
              className="text-gray-500 hover:bg-[#f0f7f1] hover:text-[#0C3B2E] block px-4 py-2 text-base font-medium"
            >
              Messages
            </Link>
            <Link
              to="/create-job"
              className="text-gray-500 hover:bg-[#f0f7f1] hover:text-[#0C3B2E] block px-4 py-2 text-base font-medium"
            >
              Create Job
            </Link>

            {/* Mobile Auth Section */}
            {user ? (
              <>
                <div className="px-4 py-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500">
                    Signed in as {user.name}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-[#0C3B2E] hover:bg-[#f0f7f1]"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-[#0C3B2E] hover:bg-[#f0f7f1]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="px-4 py-2">
                <Link
                  to="/signin"
                  className="block w-full text-center bg-[#0C3B2E] text-white px-4 py-2 rounded-md text-base font-medium hover:bg-[#6D9773]"
                >
                  Connect Wallet
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;