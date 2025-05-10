import React from 'react';
import { Clock, DollarSign, MapPin, Star, Briefcase, Heart, ThumbsDown } from 'lucide-react';

export default function JobCard({
  title,
  company,
  budget,
  location,
  description,
  skills,
  postedTime,
  experience,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="text-gray-600 hover:text-red-600 transition">
          <Heart className="w-5 h-5" />
        </button>
        <button className="text-gray-600 hover:text-red-600 transition">
          <ThumbsDown className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-2 flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            {company}
            <p className='flex items-center text-green-600 font-semibold'> <span>ETH</span>
            {budget}</p>
          </p>
        </div>
        {/* <div className="flex items-center text-green-600 font-semibold">
          <DollarSign className="w-4 h-4 mr-1" />
          {budget}
        </div> */}
      </div>

      <div className="flex items-center text-gray-500 mb-3 text-sm">
        <MapPin className="w-4 h-4 mr-1" />
        {location}
        <span className="mx-2">•</span>
        <Clock className="w-4 h-4 mr-1" />
        {postedTime}
        <span className="mx-2">•</span>
        <Star className="w-4 h-4 mr-1" />
        {experience}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}