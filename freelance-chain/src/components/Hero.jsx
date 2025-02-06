import React from "react";
import marketingImage from "../assets/Images/fr.jpg"; // Replace with your actual image path

const Hero = () => {
  return (
    <div className="flex bg-[#f4f1ea]">
      <div className="flex flex-col md:flex-row bg-[#0c3b2e] h-2/4 w-9/12 ml-52 mb-20 mt-20 rounded-2xl shadow-lg">
        <div className="md:w-1/2 text-white">
          <h1 className="text-4xl p-8 font-bold mb-4">
            Boost your Skills through{" "} <br />
            <span className="text-green-400">Freelance Chain</span>
          </h1>
          <p className="text-lg mb-6 pl-8">
            Welcome to Freelance Chain, where your freelancing experience is
            redefined through security and decentralization. We empower
            freelancers and clients alike by providing a platform that
            prioritizes your privacy and data integrity. With our cutting-edge
            decentralized technology, you can collaborate seamlessly without the
            fear of data breaches or third-party interference. Join our
            community of innovators and professionals, and thrive in a secure
            environment where your work is protected, and your ideas can
            flourish.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-[#0c3b2e] justify-center mx-auto py-2 px-4 rounded hover:bg-gray-200">
                         Get Started
            </button>
           
          </div>
        </div>
        <div className="md:w-1/2 flex justify-end md:mt-0">
          <img
            src={marketingImage}
            alt="Marketing"
            className="rounded-lg w-2/4 h-full shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
