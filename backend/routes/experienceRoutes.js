// routes/experienceRoutes.js
import express from 'express';
import Experience from '../models/experience.js';
import { getEmbedding, updateEmbeddings } from '../openai.js';

const router = express.Router();

// Function to update experience embeddings in the database
const updateExperienceEmbeddings = async (experiences) => {
  await Promise.all(
    experiences.map(async (exp) => {
      try {
        if (exp.embedding) {
          console.log(
            `Experience ID ${exp._id}: Embedding already exists. Skipping update.`
          );
        } else {
          const embedding = await getEmbedding(exp.point); // Assuming `point` is the field with experience text
          console.log(`Experience ID ${exp._id}: Embedding calculated.`);

          await Experience.findByIdAndUpdate(
            exp._id,
            { embedding },
            { new: true }
          );

          console.log(
            `Experience ID ${exp._id}: Document updated with new embedding.`
          );
        }
      } catch (err) {
        console.error(
          `Error processing Experience ID ${exp._id}: ${err.message}`
        );
      }
    })
  );
  console.log('Embedding update process completed for all experiences.');
};

// Route to get all experiences and update embeddings
router.get('/update-embeddings', async (req, res) => {
  try {
    // await updateExperienceEmbeddings(experiences);
    updateEmbeddings();
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
