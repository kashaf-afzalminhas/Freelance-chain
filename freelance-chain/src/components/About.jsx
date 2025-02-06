import React from 'react';
import About1 from '../assets/Images/home.jpg';
import About2 from '../assets/Images/ab1.jpg';
import About3 from '../assets/Images/ab2.jpg';
import { FaBriefcase, FaUsers, FaCheckCircle } from 'react-icons/fa'; // Importing icons

const About = () => {
  return (
    <section className="p-6 flex flex-col lg:flex-row items-center">
      {/* Left Side: Images */}
      <div className="flex flex-col ml-48 space-y-2 lg:w-1/2">
        <img src={About1} alt="Freelancer" className="w-64 h-36 rounded-md shadow-md" />
        <div className="flex space-x-2">
          <img src={About2} alt="Freelancer" className="w-36 h-36 rounded-md shadow-md" />
          <img src={About3} alt="Freelancer" className="w-36 h-36 rounded-md shadow-md" />
        </div>
      </div>

      {/* Right Side: Text */}
      <div className="lg:w-1/2 mr-32 text-center lg:text-left lg:ml-8">
        <h2 className="text-3xl font-semibold mb-4">About Us</h2>
        <p className="mb-6 text-lg">
          Find Your Next Freelance Job. As a leading freelance job portal in India,
          we connect talented individuals with businesses seeking top-notch freelancers.
          Join us and discover a world of possibilities.
        </p>

        {/* Icons Section */}
        <div className="flex justify-center lg:justify-start space-x-8 mt-6">
          <div className="flex flex-col items-center">
            <FaBriefcase className="text-4xl text-[#6e986e]" />
            <span>Freelance Jobs</span>
          </div>
          <div className="flex flex-col items-center">
            <FaUsers className="text-4xl text-[#6e986e]" />
            <span>Talented Individuals</span>
          </div>
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-4xl text-[#6e986e]" />
            <span>Top-notch Services</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;