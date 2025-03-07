import React from "react";

const steps = [
  { title: "Create Account", description: "Sign up and complete your profile." },
  { title: "Find Work", description: "Browse jobs that match your skills." },
  { title: "Get Paid", description: "Complete projects and receive payments securely." },
];

const HowItWorks = () => {
  return (
    <section className="px-10 py-16 text-center">
      <h3 className="text-3xl font-semibold mb-6">How FreelanceChain Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-md">
            <h4 className="text-xl font-semibold">{step.title}</h4>
            <p className="text-gray-600 mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
