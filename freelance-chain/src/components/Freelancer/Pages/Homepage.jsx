

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import cover from '../../../assets/Images/ab2.jpg'
// import Navbar from '../Cards/Navbar';

// const Homepage = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const handleSignOut = () => {
//     // Clear localStorage
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('userId');
  
//     // Redirect to login page
//     window.location.href = '/signin';
//   };
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation */}
//       <header className="border-b border-gray-200">
//   <div className="container mx-auto px-4 py-3">
//     <div className="flex justify-between items-center">
//       <div className="flex items-center">
//         <a href="/" className="text-green-900 font-bold text-lg">FreelanceChain</a>
//       </div>

//     <Navbar/>

//       <div className="flex items-center space-x-4">
//         {user ? (
//           <div className="relative">
//             <button className="flex items-center text-sm text-green-900 hover:text-green-800">
//               <span>Hello, {user.name}</span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 ml-2"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>

//             {/* Dashboard Dropdown */}
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
//               <a
//                 href="#"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Profile
//               </a>
//               <a
//                 href="#"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Settings
//               </a>
//               <button
//                 onClick={handleSignOut}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <Link
//               to="/signin"
//               className="text-sm bg-white text-green-900 border border-green-900 px-4 py-2 rounded-md hover:bg-green-100"
//             >
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className="text-sm bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-800 ml-2"
//             >
//               Sign Up
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// </header>
//       {/* Hero Section */}
//       <section className="py-8 md:py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="w-full md:w-1/2 mb-8 md:mb-0">
//               <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">
//                 Find the <span className="text-green-700">Perfect Freelance</span> Services for Your Business
//               </h1>
//               <p className="text-gray-600 mb-8 max-w-lg">
//                 Connect with top freelancers and get your projects done efficiently and professionally.
//               </p>
//               <div className="flex space-x-4">
//                 <button className="bg-green-900 text-white px-5 py-2 rounded-md hover:bg-green-800">Get Started</button>
//                 <button className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-50">Explore</button>
//               </div>
//             </div>
//             <div className="w-full md:w-1/2">
//               <img 
//                 src={cover} 
//                 alt="Freelance workspace with laptop and plant" 
//                 className="rounded-lg shadow-md w-full h-1/2"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Popular Categories */}
//       <section className="py-8 md:py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl font-bold text-center text-green-900 mb-8">Popular Categories</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
//             <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
//               <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
//                 </svg>
//               </div>
//               <h3 className="text-sm font-medium">Web Development</h3>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
//               <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//               </div>
//               <h3 className="text-sm font-medium">Content Writing</h3>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
//               <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
//                 </svg>
//               </div>
//               <h3 className="text-sm font-medium">Graphic Design</h3>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
//               <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
//                 </svg>
//               </div>
//               <h3 className="text-sm font-medium">Digital Marketing</h3>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Top Rated Freelancers */}
//       <section className="py-8 md:py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl font-bold text-center text-green-900 mb-8">Top Rated Freelancers</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//               <div className="flex items-center mb-4">
//                 <img src="/api/placeholder/50/50" alt="Profile" className="w-12 h-12 rounded-full mr-3" />
//                 <div>
//                   <h3 className="font-semibold">Sarah Johnson</h3>
//                   <div className="flex items-center">
//                     <div className="flex text-yellow-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                       <span className="ml-1 text-xs">4.9 (78 Reviews)</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mb-4">UI/UX Designer specializing in mobile app interfaces and user-centered design.</p>
//               <button className="text-xs border border-green-900 text-green-900 px-3 py-1 rounded-md hover:bg-green-50">View Profile</button>
//             </div>
            
//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//               <div className="flex items-center mb-4">
//                 <img src="/api/placeholder/50/50" alt="Profile" className="w-12 h-12 rounded-full mr-3" />
//                 <div>
//                   <h3 className="font-semibold">David Chen</h3>
//                   <div className="flex items-center">
//                     <div className="flex text-yellow-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                       <span className="ml-1 text-xs">4.8 (45 Reviews)</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mb-4">Full Stack Developer with expertise in React, Node.js, and modern web applications.</p>
//               <button className="text-xs border border-green-900 text-green-900 px-3 py-1 rounded-md hover:bg-green-50">View Profile</button>
//             </div>
            
//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//               <div className="flex items-center mb-4">
//                 <img src="/api/placeholder/50/50" alt="Profile" className="w-12 h-12 rounded-full mr-3" />
//                 <div>
//                   <h3 className="font-semibold">Emma Oliver</h3>
//                   <div className="flex items-center">
//                     <div className="flex text-yellow-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                       <span className="ml-1 text-xs">4.9 (63 Reviews)</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mb-4">Content Strategist and Copywriter helping brands find their voice and engage audiences.</p>
//               <button className="text-xs border border-green-900 text-green-900 px-3 py-1 rounded-md hover:bg-green-50">View Profile</button>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* How It Works */}
//       <section className="py-8 md:py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl font-bold text-center text-green-900 mb-8">How FreelanceChain Works</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-12 h-12 flex items-center justify-center mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//               </div>
//               <h3 className="font-semibold mb-2">Create Account</h3>
//               <p className="text-sm text-gray-600">Sign up and complete your profile with skills and experience</p>
//             </div>
            
//             <div className="flex flex-col items-center text-center">
//               <div className="w-12 h-12 flex items-center justify-center mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//               <h3 className="font-semibold mb-2">Find Work</h3>
//               <p className="text-sm text-gray-600">Browse projects and apply to ones that match your skills</p>
//             </div>
            
//             <div className="flex flex-col items-center text-center">
//               <div className="w-12 h-12 flex items-center justify-center mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <h3 className="font-semibold mb-2">Get Paid</h3>
//               <p className="text-sm text-gray-600">Complete projects successfully and receive secure payments</p>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* CTA Section */}
//       <section className="py-10 md:py-16 bg-green-900 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Freelance Journey?</h2>
//           <p className="text-green-100 mb-8 max-w-2xl mx-auto">Join thousands of professionals already using our platform to grow their freelance business</p>
//           <button className="bg-white text-green-900 px-6 py-3 rounded-full font-medium hover:bg-green-100">Get Started Now</button>
//         </div>
//       </section>
      
//       {/* Footer */}
//       <footer className="py-8 bg-white border-t border-gray-200">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h3 className="font-bold text-sm mb-3">FreelanceChain</h3>
//               <p className="text-xs text-gray-600">Connecting talent with opportunity</p>
//             </div>
            
//             <div>
//               <h3 className="font-bold text-sm mb-3">For Freelancers</h3>
//               <ul className="text-xs text-gray-600 space-y-2">
//                 <li>Browse Jobs</li>
//                 <li>Find Work</li>
//                 <li>Payment Info</li>
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="font-bold text-sm mb-3">For Clients</h3>
//               <ul className="text-xs text-gray-600 space-y-2">
//                 <li>Post a Job</li>
//                 <li>Find Talent</li>
//                 <li>How it Works</li>
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="font-bold text-sm mb-3">Follow Us</h3>
//               <div className="flex space-x-3">
//                 <a href="#" className="text-gray-600 hover:text-green-900">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//                   </svg>
//                 </a>
//                 <a href="#" className="text-gray-600 hover:text-green-900">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//                   </svg>
//                 </a>
//                 <a href="#" className="text-gray-600 hover:text-green-900">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
//                   </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
          
//           <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
//             <p>© 2025 FreelanceChain. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Homepage;





import React from 'react';
import { FaEthereum, FaShieldAlt, FaHandshake, FaChartLine, FaUserCheck, FaFileContract } from 'react-icons/fa';
import { SiBlockchaindotcom } from 'react-icons/si';
import Navbar from '../Cards/Navbar';
import Footer from '../Cards/footer';
import { useNavigate } from 'react-router-dom';
const Homepage = () => {
    const navigate = useNavigate();
  const featuredFreelancers = [
    {
      id: 1,
      name: "Alex Johnson",
      title: "Blockchain Developer",
      skills: ["Solidity", "Smart Contracts", "Web3"],
      rating: 4.9,
      projects: 42
    },
    {
      id: 2,
      name: "Sarah Chen",
      title: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Web Design"],
      rating: 4.8,
      projects: 36
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "MongoDB"],
      rating: 4.7,
      projects: 28
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: "NFT Marketplace Development",
      description: "Build a decentralized NFT marketplace with bidding functionality",
      budget: "$5,000 - $10,000",
      skills: ["Solidity", "React", "IPFS"]
    },
    {
      id: 2,
      title: "DeFi Dashboard UI",
      description: "Design a clean, intuitive interface for a DeFi analytics platform",
      budget: "$3,000 - $6,000",
      skills: ["UI Design", "Figma", "Web3"]
    },
    {
      id: 3,
      title: "DAO Governance System",
      description: "Develop a governance system for a decentralized autonomous organization",
      budget: "$8,000 - $15,000",
      skills: ["Smart Contracts", "Voting Systems", "Blockchain"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
     
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0C3B2E] to-[#6D9773] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Work. Earn. <span className="text-[#FFBA00]">Own Your Future.</span>
              </h1>
              <p className="text-xl mb-8">
                The decentralized freelancing platform where you keep 100% of your earnings, powered by blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button  onClick={() => navigate('/signin')} className="bg-[#FFBA00] hover:bg-[#BB8A52] text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
                  Join the Decentralized Revolution
                </button>
                <button className="border-2 border-white hover:bg-white hover:text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
                  How It Works
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex items-center mb-4">
                  <SiBlockchaindotcom className="text-3xl mr-3 text-[#FFBA00]" />
                  <h3 className="text-xl font-semibold">Blockchain-Powered</h3>
                </div>
                <p className="mb-6">Every transaction and contract is secured on the blockchain for complete transparency.</p>
                
                <div className="flex items-center mb-4">
                  <FaHandshake className="text-3xl mr-3 text-[#FFBA00]" />
                  <h3 className="text-xl font-semibold">No Middlemen</h3>
                </div>
                <p className="mb-6">Connect directly with clients or freelancers with no platform fees taking your hard-earned money.</p>
                
                <div className="flex items-center">
                  <FaShieldAlt className="text-3xl mr-3 text-[#FFBA00]" />
                  <h3 className="text-xl font-semibold">Secure Payments</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">Why Trust FreelanceChain?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're redefining freelancing with blockchain technology to give you more control, security, and freedom.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f8f9fa] p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-[#6D9773] p-3 rounded-full">
                  <FaFileContract className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-[#0C3B2E]">Smart Contracts</h3>
              <p className="text-gray-600 text-center">
                Automated, transparent agreements that execute only when work is completed to satisfaction.
              </p>
            </div>
            <div className="bg-[#f8f9fa] p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-[#6D9773] p-3 rounded-full">
                  <FaEthereum className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-[#0C3B2E]">Crypto Payments</h3>
              <p className="text-gray-600 text-center">
                Get paid instantly in cryptocurrency with low fees and no chargebacks.
              </p>
            </div>
            <div className="bg-[#f8f9fa] p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-[#6D9773] p-3 rounded-full">
                  <FaUserCheck className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-[#0C3B2E]">Verified Users</h3>
              <p className="text-gray-600 text-center">
                Blockchain-based identity verification ensures you're working with real professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-white to-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">How FreelanceChain Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A simple, transparent process powered by blockchain technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Create Profile</h3>
              <p className="text-gray-600">Set up your decentralized identity and showcase your skills.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Find Work</h3>
              <p className="text-gray-600">Browse projects or get matched based on your expertise.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Agree Terms</h3>
              <p className="text-gray-600">Create a smart contract with clear deliverables and payment terms.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Get Paid</h3>
              <p className="text-gray-600">Receive instant payment upon completion, with no middleman fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">Featured Freelancers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Top professionals building the future of work on FreelanceChain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFreelancers.map(freelancer => (
              <div key={freelancer.id} className="bg-[#f8f9fa] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-[#6D9773] h-3"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#0C3B2E]">
                      {freelancer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-[#0C3B2E]">{freelancer.name}</h3>
                      <p className="text-[#BB8A52]">{freelancer.title}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700">{freelancer.rating} ({freelancer.projects} projects)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.map((skill, index) => (
                      <span key={index} className="bg-[#0C3B2E] text-white text-xs px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                  <button className="w-full bg-[#0C3B2E] hover:bg-[#6D9773] text-white py-2 rounded-md transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gradient-to-b from-[#f8f9fa] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">Featured Projects</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Exciting opportunities available now on FreelanceChain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#0C3B2E] p-4 text-white">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="mb-4">
                    <span className="font-semibold text-[#0C3B2E]">Budget:</span> {project.budget}
                  </div>
                  <div className="mb-6">
                    <span className="font-semibold text-[#0C3B2E]">Skills Required:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.skills.map((skill, index) => (
                        <span key={index} className="bg-[#6D9773] text-white text-xs px-2 py-1 rounded">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-[#FFBA00] hover:bg-[#BB8A52] text-[#0C3B2E] font-semibold py-2 rounded-md transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0C3B2E] to-[#6D9773] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Future of Freelancing?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Take control of your career with zero platform fees, secure payments, and complete transparency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#FFBA00] hover:bg-[#BB8A52] text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
              Sign Up as Freelancer
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
              Post a Project
            </button>
          </div>
        </div>
      </section>
      
    </div>

  );
};

export default Homepage;