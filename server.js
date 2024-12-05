import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import Experience from './models/experience.js';
dotenv.config();

const app = express();
const port = 8000;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

app.use(express.json());

app.get('/resume', async (req, res) => {
try {
    const experiences = await Experience.find();
    res.json(experiences); 
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
