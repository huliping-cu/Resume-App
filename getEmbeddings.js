// Utility to calculate cosine similarity
export function cosineSimilarity(a, b) {
  // Ensure both vectors are non-empty
  if (!a || !b || a.length !== b.length) return 0;

  // Calculate dot product of a and b
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] ** 2;
    magnitudeB += b[i] ** 2;
  }

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

// Function to get top 5 documents based on similarity to JDEmbedding
export async function getEmbeddings(JDEmbedding, Experience) {
  try {
    // Retrieve all experiences from the collection
    const experiences = await Experience.find();

    // Array to store similarity scores with corresponding experience points
    const similarities = [];

    // Loop through each experience and calculate similarity
    for (const exp of experiences) {
      const docEmbedding = exp.embedding; // Assuming `embedding` is the field name

      // Calculate cosine similarity between JDEmbedding and document embedding
      const similarity = cosineSimilarity(JDEmbedding, docEmbedding);

      // Push the similarity and experience point into the array
      similarities.push({
        experience: exp.point, // Assuming `point` is the experience text or field you want
        similarity: similarity,
      });
    }

    // Sort by similarity in descending order (highest similarity first)
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Return the top 5 most similar experiences
    const top5Experiences = similarities.slice(0, 5);

    // Return the experience points of the top 5
    return top5Experiences.map((item) => item.experience);
  } catch (error) {
    console.error('Error fetching and comparing embeddings:', error);
    throw error; // Optionally re-throw or handle more gracefully
  }
}
