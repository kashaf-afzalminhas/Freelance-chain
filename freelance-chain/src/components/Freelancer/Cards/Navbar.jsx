import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold">FreelanceChain</h1>
      <div className="space-x-6">
        <a href="#" className="text-gray-600 hover:text-black">Home</a>
        <a href="#" className="text-gray-600 hover:text-black">Explore</a>
        <a href="#" className="text-gray-600 hover:text-black">Top Freelancers</a>
        <a href="#" className="text-gray-600 hover:text-black">How it Works</a>
      </div>
      <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">
        Join Now
      </button>
    </nav>
  );
};

export default Navbar;
