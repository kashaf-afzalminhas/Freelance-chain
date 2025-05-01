import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-gray-50">
      <div className="max-w-lg">
        <h2 className="text-4xl font-bold">Find the Perfect Freelance Services for Your Business</h2>
        <p className="text-gray-600 mt-4">Connect with skilled freelancers, post jobs, and get your work done efficiently.</p>
        <div className="mt-6 space-x-4">
          <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">Find Talent</button>
          <button className="border border-green-600 text-green-600 px-6 py-3 rounded-md hover:bg-green-100">Post a Job</button>
        </div>
      </div>
      <img src="/hero-image.jpg" alt="Freelancing" className="w-full md:w-1/2 mt-6 md:mt-0 rounded-lg shadow-md" />
    </section>
  );
};

export default Hero;
