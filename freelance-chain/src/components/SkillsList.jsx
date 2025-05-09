import React from 'react';

const SkillsList = ({ skills = [], ratings = [] }) => {
  const hasRatings = ratings.length > 0;

  if (!skills.length && !ratings.length) {
    return (
      <div className="text-gray-500 italic text-sm">
        No skills listed yet.
      </div>
    );
  }

  if (hasRatings) {
    return (
      <div className="space-y-3">
        {ratings.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">{item.skill}</span>
              <span className="text-xs text-gray-500">{item.rating}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(item.rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default SkillsList;
