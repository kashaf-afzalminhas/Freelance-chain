import React from 'react';
import HomeCover from '../assets/Images/fchome.jpg';

const Header = () => {
  return (
    <header 
      className="relative h-96 md:h-[500px] lg:h-[600px] bg-cover bg-center" // Increased heights
      style={{ backgroundImage: `url(${HomeCover})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for better text visibility */}
      <div className="relative z-10 text-center text-white p-6">
        <h1 className="text-4xl font-bold">Kashaf Jobs</h1>
        <p className="mt-2 text-xl">Find Your Next Freelance Job</p>
      </div>
    </header>
  );
};

export default Header;