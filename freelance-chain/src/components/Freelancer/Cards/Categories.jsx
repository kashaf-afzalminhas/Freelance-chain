import React from "react";

const categories = [
  { name: "Web Development", icon: "💻" },
  { name: "Graphic Design", icon: "🎨" },
  { name: "Content Writing", icon: "✍️" },
  { name: "SEO & Marketing", icon: "📈" },
];

const Categories = () => {
  return (
    <section className="px-10 py-16 text-center">
      <h3 className="text-3xl font-semibold mb-6">Popular Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-md">
            <span className="text-4xl">{category.icon}</span>
            <p className="mt-2 text-lg">{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
