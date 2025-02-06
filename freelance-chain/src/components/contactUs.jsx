import React from "react";

const Contact = () => {
  return (
    <main>
      {/* Hero Section */}
      <div className="text-center py-16 bg-gray-100">
        <h2 className="text-4xl font-bold text-[#0C3B2E]">Contact Us</h2>
        <p className="text-gray-600 mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Contact Section */}
      <section className="container mx-auto grid md:grid-cols-2 gap-8 py-16 px-6">
        {/* Left Column */}
        <div>
          <h3 className="text-2xl font-bold text-[#0C3B2E]">Get In Touch</h3>
          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet accumsan eros, sit amet auctor nunc. Nullam ac purus.
          </p>
          <div className="mt-8 space-y-6">
            {/* Address */}
            <div className="flex items-center space-x-4">
              <div className="text-[#FFBA00]">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <p className="text-gray-700">London Eye, London, UK</p>
            </div>
            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="text-[#FFBA00]">
                <i className="fas fa-phone-alt"></i>
              </div>
              <p className="text-gray-700">+123-456-7890</p>
            </div>
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="text-[#FFBA00]">
                <i className="fas fa-envelope"></i>
              </div>
              <p className="text-gray-700">mailto@subx.com</p>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="bg-#0C3B2E p-8 shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold text-[#0C3B2E]">Send a Message</h3>
          <form className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
            />
            <input
              type="email"
              placeholder="E-mail address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
            ></textarea>
            <button
              type="submit"
              className="bg-[#FFBA00] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#BB8A52] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
