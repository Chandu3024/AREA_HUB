import React from "react";

const getStarRating = ({rating}) => {
    const filledStars = Math.floor(rating); // Number of filled stars
    const halfStar = rating % 1 !== 0; // If there's a half star
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0); // Remaining empty stars
  
    return (
      <div className="star-rating">
        {Array(filledStars)
          .fill(0)
          .map((_, index) => (
            <span key={`filled-${index}`}>&#9733;</span> // Unicode for filled star
          ))}
        {halfStar && <span>&#9734;</span>} {/* Unicode for half-filled star */}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <span key={`empty-${index}`}>&#9734;</span> // Unicode for empty star
          ))}
      </div>
    );
  };

  export default getStarRating;