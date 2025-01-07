import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#0c3b2e] p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">Freelance Chain</h1>
        <ul className="flex space-x-4 justify-center flex-grow">
          <li>
            <a href="/" className="text-white hover:underline">Home</a>
          </li>
          <li>
            <a href="#about" className="text-white hover:underline">About</a>
          </li>
          <li>
            <a href="#services" className="text-white hover:underline">Services</a>
          </li>
          <li>
            <a href="#gallery" className="text-white hover:underline">Gallery</a>
          </li>
          <li>
            <a href="#contact" className="text-white hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;