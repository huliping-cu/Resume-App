// routes/jobDescriptionRoutes.js
import express from 'express';
import { getEmbedding, updateEmbeddings } from '../openai.js';
import { getEmbeddings } from '../getEmbeddings.js';
const router = express.Router();
import Experience from '../models/experience.js';

// // Route to submit job description
// router.post('/submit-job-description', (req, res) => {
//   const { jobDescription } = req.body;
//   console.log('Received Job Description:', jobDescription);

//   // Simulate processing the job description to generate 5 points
//   const points = [
//     'Strong communication skills are required.',
//     'Experience with JavaScript frameworks is a plus.',
//     'Knowledge of cloud computing is essential.',
//     'Proficiency in Node.js and React is expected.',
//     'Ability to manage and debug backend services is important.',
//   ];

//   res.json({
//     message: 'Job description processed successfully!',
//     points,
//   });
// });

router.post('/submit-job-description', async (req, res) => {
  console.log('submit-job-description entered');
  const { jobDescription } = req.body;
  console.log('Received Job Description:', jobDescription);

  try {
    // Call getEmbedding to calculate the embedding for the job description
    const embedding_calculated = await getEmbedding(jobDescription);

    // Extract the embedding array from the response
    const jobDescriptionEmbedding = embedding_calculated.data[0].embedding;
    console.log(
      jobDescriptionEmbedding
      // jobDescriptionEmbedding[1],
      // jobDescriptionEmbedding[10],
      // jobDescriptionEmbedding[20]
    );
    // Call getEmbeddings to compare job description embedding with experience embeddings
    const topExperiences = await getEmbeddings(
      jobDescriptionEmbedding,
      Experience
    );
    console.log('topExperiences' + topExperiences);

    res.json({
      message: 'Job description processed successfully!!!!',
      embedding: topExperiences, // Return the embedding in the response
    });
  } catch (error) {
    console.error('Error calculating embedding for job description:', error);
    res.status(500).json({ message: 'Error processing job description.' });
  }
});

export default router;
