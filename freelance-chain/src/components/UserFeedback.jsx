// Testimonials.js
import React from 'react';
import Image1 from '../assets/Images/ab1.jpg';
const testimonialsData = [
  {
    text: "Kashaf Jobs has transformed my freelance journey by connecting me with high-quality clients while providing ample support.",
    name: "Client Name 1",
    rating: 5,
    image: {Image1}, // Replace with actual image path
  },
  {
    text: "As a business owner, finding reliable freelancers was a challenge until I discovered Kashaf Jobs. The platform streamlines the hiring process and ensures top-notch talent.",
    name: "Client Name 2",
    rating: 5,
    image: {Image1}, // Replace with actual image path
  },
  {
    text: "I have been able to expand my graphic design expertise and network with amazing clients through Kashaf Jobs.",
    name: "Client Name 3",
    rating: 5,
    image: {Image1}, // Replace with actual image path
  },
];

const Testimonials = () => {
  return (
    <section className="p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold text-center mb-6">Client Testimonials</h2>
      <div className="flex flex-col md:flex-row md:justify-around">
        {testimonialsData.map((testimonial, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-lg w-full md:w-1/3 m-2">
            <p className="mb-4">"{testimonial.text}"</p>
            <div className="flex items-center">
              <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-2" />
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <div>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;