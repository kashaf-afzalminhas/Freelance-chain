// EndlessPossibilities.js
import React from 'react';
import Image1 from '../assets/Images/ab1.jpg'; // Replace with actual image path
 // Replace with actual image path

const EndlessPossibilities = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center p-6">
      <div className="lg:w-1/2 text-center lg:text-left lg:pr-8">
        <h2 className="text-3xl font-semibold mb-4">Endless Possibilities</h2>
        <p className="mb-6">
          As a leading freelance job portal in India, we connect talented individuals with businesses seeking top-notch freelancers. Join us and discover a world of possibilities.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Job Matching</li>
          <li>Secure Payments</li>
          <li>Professional Development</li>
        </ul>
      </div>
      <div className="lg:w-1/2">
        <img src={Image1} alt="Possibilities" className="rounded-lg shadow-md mb-4" />
        <img src={Image1} alt="Possibilities" className="rounded-lg shadow-md" />
      </div>
    </section>
  );
};

export default EndlessPossibilities;