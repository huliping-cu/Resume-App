import React, { useState } from 'react';
import axios from 'axios';

const JobDescriptionForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:8000/submit-job-description',
        { jobDescription }
      );
      console.log(response.data);

      setResponseData(response.data); // Update response data
    } catch (error) {
      setError('Error submitting job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Submit Job Description</h2>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description here"
          rows="5"
          cols="40"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {responseData && (
        <div>
          <h3>Job Description Embedding and Similar Experiences</h3>
          <h4>Embedding:</h4>
          <pre>
            {JSON.stringify(responseData.jobDescriptionEmbedding, null, 2)}
          </pre>

          <h4>Top Similar Experiences:</h4>
          <ul>
            {Array.isArray(responseData.embedding) &&
            responseData.embedding.length > 0 ? (
              responseData.embedding.map((experience, index) => (
                <li key={index}>{experience}</li>
              ))
            ) : (
              <p>No similar experiences found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionForm;
