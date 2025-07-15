import React, { useState, useEffect } from 'react';
import styles from '../../public/style.css';

const LeadCounter = ({ title, count }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = count;
    const duration = 2000; // Animation duration in ms
    const increment = end / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="counter-card">
      <h3>{title}</h3>
      <div className="counter-value">{displayCount}</div>
    </div>
  );
};

export default LeadCounter;