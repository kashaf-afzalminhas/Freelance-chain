import React from 'react';
import consultingImage from '../assets/Images/home.jpg'; // Replace with your actual image path

const ConsultingSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-[#f4f1ea] p-8 rounded-lg shadow-lg">
      <div className="md:w-1/2">
        <img 
          src={consultingImage} 
          alt="Consulting" 
          className="rounded-lg shadow-md" 
        />
      </div>
      <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
        <h2 className="text-2xl font-bold mb-4">Your one stop to all consulting needs</h2>
        <p className="text-gray-700 mb-6">
          In dui magna, posuere eget, vestibulum at, tempor auctor, justo.
          Proin consequat erat massa. Vivamus euismod elit.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span> Trusted by thousands
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span> Certificate awarded
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span> Weekly reports
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2">✔️</span> Proven track of success
          </li>
        </ul>
        <button className="mt-4 bg-[#0c3b2e] text-white py-2 px-4 rounded">
          About me
        </button>
      </div>
    </div>
  );
};

export default ConsultingSection;