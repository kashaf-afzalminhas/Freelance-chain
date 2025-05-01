import React from 'react';

const services = [
  {
    title: 'Google Ads',
    description: 'Mauris sollicitudin fermentum libero. Vivamus aliquet elit ac nisl.',
    isFeatured: true,
  },
  {
    title: 'Human resources',
    description: 'Mauris sollicitudin fermentum libero. Vivamus aliquet elit ac nisl.',
  },
  {
    title: 'Project management',
    description: 'Mauris sollicitudin fermentum libero. Vivamus aliquet elit ac nisl.',
  },
  {
    title: 'Design',
    description: 'Mauris sollicitudin fermentum libero. Vivamus aliquet elit ac nisl.',
  },
  {
    title: 'Social media',
    description: 'Mauris sollicitudin fermentum libero. Vivamus aliquet elit ac nisl.',
  },
  {
    title: 'Website Developement',
    description: 'Mauris sollicitudin fermentum libero. Vivamus aliquet elit ac nisl.',
  },
];

const Services = () => {
  return (
    <div className="flex p-8 bg-[#fdf8ec] justify-center items-center">
      {/* Left Side: Heading and Button */}
      <div className="w-1/3 pr-6">
        <h2 className="text-2xl font-bold mb-6 flex justify-center items-center ">Amazing services</h2>
         <p className="mb-6 text-lg">
                  Find Your Next Freelance Job. As a leading freelance job portal in India,
                  we connect talented individuals with businesses seeking top-notch freelancers.
                  Join us and discover a world of possibilities.
                </p>
        
        <button className='bg-green-900 flex justify-center mx-auto text-white rounded-sm p-2'>
          View Jobs
        </button>
      </div>
      
      {/* Right Side: Service Cards */}
      <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-md hover:bg-[#0c3b2e]  hover:text-white  ${service.isFeatured ? 'bg-[#0c3b2e]  text-white' : 'bg-white'}`}
          >
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="mb-4">{service.description}</p>
            <a href="#" className={`text-blue-500 font-bold ${service.isFeatured ? 'hover:underline' : 'text-gray-800 hover:underline'}`}>
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;