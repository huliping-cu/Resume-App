import React from 'react';
import { useLocation } from 'react-router-dom';

const JDPage = () => {
  const location = useLocation();
  const points = location.state?.points || [];

  return (
    <div>
      <h2>Job Description Processed</h2>
      <p>Here are the key points extracted from the job description:</p>
      <ul>
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default JDPage;
