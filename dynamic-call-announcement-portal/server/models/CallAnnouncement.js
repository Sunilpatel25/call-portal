import mongoose from 'mongoose';

const callAnnouncementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Closed'], default: 'Published' },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { 
  timestamps: true 
});

export default mongoose.model('CallAnnouncement', callAnnouncementSchema);
