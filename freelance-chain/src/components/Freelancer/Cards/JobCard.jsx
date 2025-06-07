import React, { useState, useEffect } from 'react';
import { Clock, DollarSign,ThumbsDown, MapPin, Star, Briefcase, Heart, Bookmark } from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function JobCard({
  _id,
  title,
  company,
  budget,
  location,
  description,
  skills,
  postedTime,
  experience,
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await api.get('/saved-jobs');
        const savedJobs = response.data;
        setIsSaved(savedJobs.some(job => job._id === _id));
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    checkIfSaved();
  }, [_id]);

  const toggleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${_id}`);
        toast.success('Job removed from saved');
      } else {
        await api.post('/saved-jobs', { jobId: _id });
        toast.success('Job saved successfully');
      }
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update saved status');
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={toggleSave}
          className={`${isSaved ? 'text-[#FFBA00]' : 'text-gray-600'} hover:text-[#FFBA00] transition`}
          disabled={loading}
        >
          <Bookmark className="w-5 h-5" fill={isSaved ? '#FFBA00' : 'none'} />
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