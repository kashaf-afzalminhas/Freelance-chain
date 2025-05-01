import React from "react";

const freelancers = [
  { name: "Sarah Johnson", rating: "⭐ 4.8", job: "UI/UX Designer" },
  { name: "Michael Chen", rating: "⭐ 4.9", job: "Full-Stack Developer" },
  { name: "Emma Wilson", rating: "⭐ 4.7", job: "SEO Expert" },
];

const TopFreelancers = () => {
  return (
    <section className="px-10 py-16 text-center">
      <h3 className="text-3xl font-semibold mb-6">Top Rated Freelancers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {freelancers.map((freelancer, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-md">
            <h4 className="text-xl font-semibold">{freelancer.name}</h4>
            <p className="text-gray-600">{freelancer.job}</p>
            <p className="mt-2 font-bold">{freelancer.rating}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopFreelancers;
