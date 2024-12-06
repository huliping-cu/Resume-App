// data.js
import mongoose from 'mongoose';

// Define the schema for your 'Experience' model
const experienceSchema = new mongoose.Schema({
  point: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number], // Assuming embedding is an array of numbers
    default: [],
  },
});

// Create the model
const Experience = mongoose.model('Experience', experienceSchema);

// Function to connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

// Fetch all experiences from the database
const getExperiences = async () => {
  try {
    return await Experience.find();
  } catch (error) {
    console.log('Error fetching experiences:', error);
  }
};

// Update experience embedding by ID
const updateExperienceEmbedding = async (experienceId, embedding) => {
  try {
    await Experience.findByIdAndUpdate(
      experienceId,
      { embedding },
      { new: true }
    );
    console.log(
      `Experience ID ${experienceId}: Document updated with new embedding.`
    );
  } catch (error) {
    console.log(`Error updating experience ID ${experienceId}:`, error);
  }
};

// Export the model and functions
export {
  Experience,
  connectToDatabase,
  getExperiences,
  updateExperienceEmbedding,
};
