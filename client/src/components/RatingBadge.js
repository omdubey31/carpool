import React from 'react';
import './RatingBadge.css';

const RatingBadge = ({ value = 0, count = 0, size = 'md' }) => {
  if (!count) {
    return <div className={`rating-badge rating-badge-${size} muted`}>New</div>;
  }

  return (
    <div className={`rating-badge rating-badge-${size}`}>
      <span className="rating-icon">⭐</span>
      <span className="rating-value">{Number(value).toFixed(1)}</span>
      <span className="rating-count">({count})</span>
    </div>
  );
};

export default RatingBadge;

