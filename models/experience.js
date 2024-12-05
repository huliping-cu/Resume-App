import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    point: { type: String, required: true }, 
  }, { collection: 'experience' }); 
  
const Experience = mongoose.model('experience', experienceSchema);

export default Experience;
