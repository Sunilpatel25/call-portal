import mongoose from 'mongoose';

const fieldDefinitionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [String]
}, { _id: false });

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['FACULTY', 'STUDENT'], required: true },
  description: { type: String, required: true },
  fields: [fieldDefinitionSchema]
}, { 
  timestamps: true 
});

export default mongoose.model('Category', categorySchema);
