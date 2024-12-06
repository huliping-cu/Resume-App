// openai.js
import OpenAI from 'openai';
import dotenv from 'dotenv';
import Experience from './models/experience.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to fetch embeddings using OpenAI
export const getEmbedding = async (text) => {
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
export const updateEmbeddings = async () => {
  try {
    const documentsToUpdate = await Experience.find({
      embeddings: { $size: 0 },
    });

    console.log(
      `Found ${documentsToUpdate.length} documents with empty embeddings`
    );

    for (const doc of documentsToUpdate) {
      const embedding_calculated = await getEmbedding(doc.point); // Assuming `point` is the field with experience text
      const embedding = embedding_calculated.data[0].embedding; // Extract the embedding array
      //   const randomEmbeddings = Array.from({ length: 5 }, () => Math.random());

      await Experience.updateOne(
        { _id: doc._id },
        { $set: { embeddings: embedding } }
      );

      console.log(`Updated document with _id: ${doc._id}`);
    }
  } catch (error) {
    console.error('Error updating documents:', error);
  }
};
