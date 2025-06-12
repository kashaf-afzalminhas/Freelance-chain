
import React from 'react';
import { FaEthereum, FaShieldAlt, FaHandshake, FaChartLine, FaUserCheck, FaFileContract } from 'react-icons/fa';
import { SiBlockchaindotcom } from 'react-icons/si';
import Navbar from '../Cards/Navbar';
import Footer from '../Cards/footer';
import { useNavigate } from 'react-router-dom';
const Homepage = () => {
    const navigate = useNavigate();
  const featuredFreelancers = [
    {
      id: 1,
      name: "Alex Johnson",
      title: "Blockchain Developer",
      skills: ["Solidity", "Smart Contracts", "Web3"],
      rating: 4.9,
      projects: 42
    },
    {
      id: 2,
      name: "Sarah Chen",
      title: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Web Design"],
      rating: 4.8,
      projects: 36
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "MongoDB"],
      rating: 4.7,
      projects: 28
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: "NFT Marketplace Development",
      description: "Build a decentralized NFT marketplace with bidding functionality",
      budget: "$5,000 - $10,000",
      skills: ["Solidity", "React", "IPFS"]
    },
    {
      id: 2,
      title: "DeFi Dashboard UI",
      description: "Design a clean, intuitive interface for a DeFi analytics platform",
      budget: "$3,000 - $6,000",
      skills: ["UI Design", "Figma", "Web3"]
    },
    {
      id: 3,
      title: "DAO Governance System",
      description: "Develop a governance system for a decentralized autonomous organization",
      budget: "$8,000 - $15,000",
      skills: ["Smart Contracts", "Voting Systems", "Blockchain"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
     
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0C3B2E] to-[#6D9773] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Work. Earn. <span className="text-[#FFBA00]">Own Your Future.</span>
              </h1>
              <p className="text-xl mb-8">
                The decentralized freelancing platform where you keep 100% of your earnings, powered by blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button  onClick={() => navigate('/signin')} className="bg-[#FFBA00] hover:bg-[#BB8A52] text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
                  Join the Decentralized Revolution
                </button>
                <button className="border-2 border-white hover:bg-white hover:text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
                  How It Works
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex items-center mb-4">
                  <SiBlockchaindotcom className="text-3xl mr-3 text-[#FFBA00]" />
                  <h3 className="text-xl font-semibold">Blockchain-Powered</h3>
                </div>
                <p className="mb-6">Every transaction and contract is secured on the blockchain for complete transparency.</p>
                
                <div className="flex items-center mb-4">
                  <FaHandshake className="text-3xl mr-3 text-[#FFBA00]" />
                  <h3 className="text-xl font-semibold">No Middlemen</h3>
                </div>
                <p className="mb-6">Connect directly with clients or freelancers with no platform fees taking your hard-earned money.</p>
                
                <div className="flex items-center">
                  <FaShieldAlt className="text-3xl mr-3 text-[#FFBA00]" />
                  <h3 className="text-xl font-semibold">Secure Payments</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">Why Trust FreelanceChain?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're redefining freelancing with blockchain technology to give you more control, security, and freedom.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f8f9fa] p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-[#6D9773] p-3 rounded-full">
                  <FaFileContract className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-[#0C3B2E]">Smart Contracts</h3>
              <p className="text-gray-600 text-center">
                Automated, transparent agreements that execute only when work is completed to satisfaction.
              </p>
            </div>
            <div className="bg-[#f8f9fa] p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-[#6D9773] p-3 rounded-full">
                  <FaEthereum className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-[#0C3B2E]">Crypto Payments</h3>
              <p className="text-gray-600 text-center">
                Get paid instantly in cryptocurrency with low fees and no chargebacks.
              </p>
            </div>
            <div className="bg-[#f8f9fa] p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-[#6D9773] p-3 rounded-full">
                  <FaUserCheck className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-[#0C3B2E]">Verified Users</h3>
              <p className="text-gray-600 text-center">
                Blockchain-based identity verification ensures you're working with real professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-white to-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">How FreelanceChain Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A simple, transparent process powered by blockchain technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Create Profile</h3>
              <p className="text-gray-600">Set up your decentralized identity and showcase your skills.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Find Work</h3>
              <p className="text-gray-600">Browse projects or get matched based on your expertise.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Agree Terms</h3>
              <p className="text-gray-600">Create a smart contract with clear deliverables and payment terms.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0C3B2E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2 text-[#0C3B2E]">Get Paid</h3>
              <p className="text-gray-600">Receive instant payment upon completion, with no middleman fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">Featured Freelancers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Top professionals building the future of work on FreelanceChain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFreelancers.map(freelancer => (
              <div key={freelancer.id} className="bg-[#f8f9fa] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-[#6D9773] h-3"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#0C3B2E]">
                      {freelancer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-[#0C3B2E]">{freelancer.name}</h3>
                      <p className="text-[#BB8A52]">{freelancer.title}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700">{freelancer.rating} ({freelancer.projects} projects)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.map((skill, index) => (
                      <span key={index} className="bg-[#0C3B2E] text-white text-xs px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                  <button className="w-full bg-[#0C3B2E] hover:bg-[#6D9773] text-white py-2 rounded-md transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gradient-to-b from-[#f8f9fa] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0C3B2E] mb-4">Featured Projects</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Exciting opportunities available now on FreelanceChain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#0C3B2E] p-4 text-white">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="mb-4">
                    <span className="font-semibold text-[#0C3B2E]">Budget:</span> {project.budget}
                  </div>
                  <div className="mb-6">
                    <span className="font-semibold text-[#0C3B2E]">Skills Required:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.skills.map((skill, index) => (
                        <span key={index} className="bg-[#6D9773] text-white text-xs px-2 py-1 rounded">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-[#FFBA00] hover:bg-[#BB8A52] text-[#0C3B2E] font-semibold py-2 rounded-md transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0C3B2E] to-[#6D9773] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Future of Freelancing?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Take control of your career with zero platform fees, secure payments, and complete transparency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#FFBA00] hover:bg-[#BB8A52] text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
              Sign Up as Freelancer
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-[#0C3B2E] font-bold py-3 px-8 rounded-lg transition-colors">
              Post a Project
            </button>
          </div>
        </div>
      </section>
      
    </div>

  );
};

export default Homepage;