import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../actions/reviewActions';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ReviewForm = ({ jobId, revieweeId, role, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  
  const { loading, error } = useSelector(state => state.reviewCreate);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createReview({
      jobId,
      revieweeId,
      role,
      rating,
      comment
    })).then(() => {
      onReviewSubmit();
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-[#6D9773]">
      <h3 className="text-xl font-semibold text-[#0C3B2E] mb-4">Leave a Review</h3>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-[#0C3B2E] mb-2">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="text-2xl focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="text-[#FFBA00]" />
                ) : (
                  <FaRegStar className="text-[#BB8A52]" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[#0C3B2E] mb-2">Comment (optional)</label>
          <textarea
            className="w-full px-3 py-2 border border-[#6D9773] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0C3B2E] focus:border-[#0C3B2E]"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading || rating === 0}
          className={`px-4 py-2 rounded-md text-white ${loading || rating === 0 ? 'bg-gray-400' : 'bg-[#6D9773] hover:bg-[#0C3B2E]'}`}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ReviewForm;