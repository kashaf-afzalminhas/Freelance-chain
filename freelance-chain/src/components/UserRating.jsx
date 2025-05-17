import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const UserRating = ({ user }) => {
  const fullStars = Math.floor(user.averageRating);
  const hasHalfStar = user.averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center mb-4">
      {user.averageRating ? (
        <>
          <div className="flex">
            {[...Array(fullStars)].map((_, i) => (
              <FaStar key={`full-${i}`} className="text-[#FFBA00] text-xl" />
            ))}
            {hasHalfStar && (
              <FaStarHalfAlt className="text-[#FFBA00] text-xl" />
            )}
            {[...Array(emptyStars)].map((_, i) => (
              <FaStar key={`empty-${i}`} className="text-gray-300 text-xl" />
            ))}
          </div>
          <span className="ml-2 text-xl font-semibold text-[#0C3B2E]">
            {user.averageRating.toFixed(1)}
          </span>
        </>
      ) : (
        <p className="text-[#BB8A52]">No ratings yet</p>
      )}
    </div>
  );
};

export default UserRating;