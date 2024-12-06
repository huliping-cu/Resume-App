import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Experience from './models/experience.js';

dotenv.config();

const app = express();
const port = 8000;
const expEmbeddings = [];

// Serve static files (like index.html, CSS, JS, etc.) from the 'public' folder
app.use(express.static('public'));

// Connect to OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

// Function to fetch embeddings using OpenAI
const getEmbedding = async (text) => {
  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });
    return embedding;
  } catch (error) {
    console.error('Error fetching embedding:', error);
  }
};

// Function to update documents with random embeddings
const updateEmbeddings = async () => {
  try {
    const documentsToUpdate = await Experience.find({
      embeddings: { $size: 0 },
    });

    console.log(
      `Found ${documentsToUpdate.length} documents with empty embeddings`
    );

    for (const doc of documentsToUpdate) {
      const randomEmbeddings = Array.from({ length: 5 }, () => Math.random());

      await Experience.updateOne(
        { _id: doc._id },
        { $set: { embeddings: randomEmbeddings } }
      );

      console.log(`Updated document with _id: ${doc._id}`);
    }
  } catch (error) {
    console.error('Error updating documents:', error);
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

// Function to fetch embeddings for experiences and store them in memory for further processing
const getEmbeddings = async (experiences) => {
  try {
    // Loop through each experience and fetch its embedding if it doesn't already have one
    for (const exp of experiences) {
      if (exp.embedding) {
        console.log(`Experience ID ${exp._id}: Embedding already exists.`);
        expEmbeddings.push(exp.embedding); // Add existing embedding to the array
      } else {
        console.log(`Experience ID ${exp._id}: Fetching embedding...`);

        // Fetch the embedding using OpenAI API
        const embedding = await getEmbedding(exp.point); // `exp.point` is assumed to be the text field
        console.log(`Experience ID ${exp._id}: Embedding fetched.`);

        // Store the embedding in memory for further processing
        expEmbeddings.push(embedding);

        // Optionally, you could update the document in the database with the new embedding
        await Experience.findByIdAndUpdate(
          exp._id,
          { embedding },
          { new: true }
        );
        console.log(
          `Experience ID ${exp._id}: Document updated with new embedding.`
        );
      }
    }

    console.log(`All embeddings fetched and stored in memory.`);
    return embeddings;
  } catch (err) {
    console.error('Error fetching embeddings:', err);
  }
};

// Set up routes

// Define the `/` route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' }); // Send the index.html file from the 'public' folder
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

// Call the function to update documents with random embeddings (optional)
updateEmbeddings();
// getEmbeddings();
// rankPoints();
