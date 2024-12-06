// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Import routes
import experienceRoutes from './routes/experienceRoutes.js';
import jobDescriptionRoutes from './routes/jobDescriptionRoutes.js';

dotenv.config();

const app = express();
const port = 8000;

// Middleware to parse JSON requests
app.use(express.json());

// Allow cross-origin requests
app.use(cors());

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

// Use route files
app.use('/', jobDescriptionRoutes); // Mount the job description routes
app.use('/', experienceRoutes); // Mount the experience routes

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start the server and connect to the database
const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// Call the server start function
startServer();

// Call the function to update documents with random embeddings (optional)
//updateEmbeddings();
// getEmbeddings();
// rankPoints();
