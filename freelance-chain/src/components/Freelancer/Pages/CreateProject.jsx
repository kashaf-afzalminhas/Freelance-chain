import React from "react";
import { useNavigate } from "react-router-dom";

const CreateServices = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/projectOverview");
  };

  return (
    <section className="container mx-auto px-6 py-16">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-4xl font-bold text-secondary">
            Create your Services
          </h2>
          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <button
            onClick={handleNavigation}
            className="mt-6 bg-highlight text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent transition"
          >
            Create Project
          </button>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src="https://via.placeholder.com/150" // Replace with the image URL
            alt="Create Services"
            className="w-32 h-32"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-secondary">About It</h3>
        <ul className="mt-8 space-y-4">
          <li className="flex items-center">
            <span className="text-highlight text-2xl mr-4">
              <i className="fas fa-check-circle"></i>
            </span>
            <span className="text-gray-700">Customize your Services</span>
          </li>
          <li className="flex items-center">
            <span className="text-highlight text-2xl mr-4">
              <i className="fas fa-check-circle"></i>
            </span>
            <span className="text-gray-700">Set your Rates</span>
          </li>
          <li className="flex items-center">
            <span className="text-highlight text-2xl mr-4">
              <i className="fas fa-check-circle"></i>
            </span>
            <span className="text-gray-700">Add extra services</span>
          </li>
          <li className="flex items-center">
            <span className="text-highlight text-2xl mr-4">
              <i className="fas fa-check-circle"></i>
            </span>
            <span className="text-gray-700">Add extra free services</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default CreateServices;
