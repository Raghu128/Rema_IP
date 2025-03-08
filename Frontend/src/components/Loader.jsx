// Loader.jsx
import React from 'react';
import '../styles/Loader.css'; // Make sure the path is correct

const Loader = ({ size = 'large', color = '#3498db', text = 'Loading...' }) => {
  // Convert size to a numeric value, with defaults
  let sizeValue;
  switch (size) {
    case 'small':
      sizeValue = 20;
      break;
    case 'large':
      sizeValue = 60;
      break;
    case 'xlarge':
      sizeValue = 80;
      break;
    default:
      sizeValue = 40; // Medium
  }

  const spinnerStyle = {
    width: `${sizeValue}px`,
    height: `${sizeValue}px`,
    borderColor: color,
    borderTopColor: 'transparent',
  };

  return (
    <div className="loader-container">
      <div className="spinner" style={spinnerStyle}></div>
      {text && <p className="loader-text" style={{ color: color }}>{text}</p>}
    </div>
  );
};

export default Loader;