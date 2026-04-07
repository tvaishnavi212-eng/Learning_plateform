import React, { useState, useEffect } from "react";

const Rating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0); // ⭐ hover state

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;

        return (
          <span
            key={index}
            className={`text-xl sm:text-2xl cursor-pointer transition-transform duration-200 ${
              starValue <= (hoverRating || rating)
                ? "text-yellow-500"
                : "text-gray-400"
            } hover:scale-110`}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
