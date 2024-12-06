import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobDescriptionForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/submit-job-description',
        { jobDescription }
      );
      const points = response.data.points;

      //alert('Job description submitted successfully');
      // Redirect to the /JD route
      // Navigate to /JD with points passed as state
      navigate('/JD', { state: { points } });
    } catch (error) {
      console.error('Error submitting job description', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Job Description</h2>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description here"
        rows="5"
        cols="40"
      />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default JobDescriptionForm;
