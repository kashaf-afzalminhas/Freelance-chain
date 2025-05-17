import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaStar } from 'react-icons/fa';

const ReviewsList = ({ userId }) => {
  const { reviews, loading, error } = useSelector(state => state.reviewList);
  
  const filteredReviews = reviews.filter(review => review.revieweeId === userId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#0C3B2E] mb-4">
        Reviews ({filteredReviews.length})
      </h2>
      
      {filteredReviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        filteredReviews.map((review) => (
          <div 
            key={review._id}
            className="bg-gray-50 p-4 mb-4 rounded-lg border-l-4 border-[#6D9773]"
          >
            <div className="flex items-center mb-2">
              <img 
                src={review.reviewerId.avatar} 
                alt={review.reviewerId.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-medium text-[#0C3B2E]">
                  {review.reviewerId.name}
                </h4>
                <div className="flex items-center">
                  <div className="flex text-[#FFBA00]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar 
                        key={star}
                        className={star <= review.rating ? 'text-[#FFBA00]' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-[#BB8A52]">
                    {moment(review.createdAt).format('MMM D, YYYY')}
                  </span>
                </div>
              </div>
              <span className={`ml-auto px-2 py-1 rounded-full text-xs text-white ${
                review.role === 'client' ? 'bg-[#6D9773]' : 'bg-[#BB8A52]'
              }`}>
                {review.role === 'client' ? 'Client' : 'Freelancer'}
              </span>
            </div>
            {review.comment && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <p className="text-gray-700">
                  {review.comment}
                </p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;