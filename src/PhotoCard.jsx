import React from 'react';
import photo from '../Изображение.png';
import './PhotoCard.css';

const PhotoCard = () => {
  return (
    <div className="photo-card">
      <img src={photo} alt="Profile" className="photo-card-image" />
      {/* You can add additional info or caption below if needed */}
    </div>
  );
};

export default PhotoCard;