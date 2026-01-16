import React from 'react';
import { FaTwitter, FaDiscord, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0C3B2E] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Freelance<span className="text-[#BB8A52]">Chain</span></h3>
            <p className="mb-4">
              The decentralized freelancing platform powered by blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#FFBA00] transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-[#FFBA00] transition-colors">
                <FaDiscord className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-[#FFBA00] transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-[#FFBA00] transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Find Work</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Freelancer Dashboard</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Skills Tests</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Post a Project</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Browse Freelancers</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Client Dashboard</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Enterprise Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#FFBA00] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#6D9773] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">© 2023 FreelanceChain. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#FFBA00] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#FFBA00] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#FFBA00] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;