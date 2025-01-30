import React from "react";
import consultingImage from "../assets/Images/home.jpg"; // Replace with your actual image path

const ConsultingSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-[#f4f1ea] p-8 rounded-lg shadow-lg">
      <div className="md:w-1/2 ml-9">
        <img
          src={consultingImage}
          alt="Consulting"
          className="rounded-lg shadow-md"
        />
      </div>
      <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
        <h2 className="text-2xl font-bold mb-4">
          Your Go-To Hub for All Freelancing Services
        </h2>
        <p className="text-gray-700 mb-6">
          At Freelance Chain, we connect clients with top-tier freelancers to
          fulfill every project need. Our platform enables seamless
          collaboration and ensures that your vision is brought to life with
          professionalism and expertise.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span>Trusted by a Global Community
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span> Verified Professionals
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span> Detailed Project Updates
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span> Proven Track Record of Excellence
      
          </li>
        </ul>
        <button className="mt-4 bg-[#0c3b2e] text-white py-2 px-4 rounded">
          About Us
        </button>
      </div>
    </div>
  );
};

export default ConsultingSection;
