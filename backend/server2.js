// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getEmbedding } from './openai.js'; // Import the OpenAI helper
import Experience from './models/experience.js';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 8000;
const expEmbeddings = [];

// Middleware to parse JSON requests
app.use(express.json());

// Allow cross-origin requests
app.use(cors());

// Serve static files (like index.html, CSS, JS, etc.) from the 'public' folder
app.use(express.static('public'));

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

// Function to update experience embeddings in the database
const updateExperienceEmbeddings = async (experiences) => {
  await Promise.all(
    experiences.map(async (exp) => {
      try {
        // Check if the experience already has an embedding
        if (exp.embedding) {
          console.log(
            `Experience ID ${exp._id}: Embedding already exists. Skipping update.`
          );
        } else {
          // Calculate embedding and update the document
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

// Set up routes

// Define the `/` route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' }); // Send the index.html file from the 'public' folder
});

// Job description endpoint
app.post('/submit-job-description', (req, res) => {
  const { jobDescription } = req.body;
  console.log('Received Job Description:', jobDescription);

  // Simulate processing the job description to generate 5 points
  const points = [
    'Strong communication skills are required.',
    'Experience with JavaScript frameworks is a plus.',
    'Knowledge of cloud computing is essential.',
    'Proficiency in Node.js and React is expected.',
    'Ability to manage and debug backend services is important.',
  ];

  res.json({
    message: 'Job description processed successfully!',
    points,
  });
});

app.get('/resume', async (req, res) => {
  try {
    const experiences = await Experience.find();
    const jobDescription = 'computer science';

    // Update experiences with embeddings if they don't already have one
    await updateExperienceEmbeddings(experiences);

    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server and connect to database
const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// Call the server start function
startServer();
