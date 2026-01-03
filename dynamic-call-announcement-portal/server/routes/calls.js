import express from 'express';
import CallAnnouncement from '../models/CallAnnouncement.js';
import upload from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper function to transform call document to plain object
const transformCall = (call) => {
  if (!call) return null;
  const callObj = call.toObject ? call.toObject() : call;
  const transformed = {
    ...callObj,
    createdAt: callObj.createdAt ? (callObj.createdAt instanceof Date ? callObj.createdAt.toISOString() : callObj.createdAt) : new Date().toISOString(),
    // Ensure data.attachment is properly structured
    data: callObj.data || {},
  };
  
  // Debug: Log attachment data
  if (transformed.data && transformed.data.attachment) {
    console.log('TransformCall - Attachment found:', transformed.data.attachment);
  }
  
  return transformed;
};

// Get all call announcements
router.get('/', async (req, res) => {
  try {
    const calls = await CallAnnouncement.find().sort({ createdAt: -1 });
    const transformedCalls = calls.map(transformCall);
    res.json(transformedCalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download file by original filename (MUST be before /:id route)
router.get('/download/:filename', async (req, res) => {
  try {
    const originalFilename = decodeURIComponent(req.params.filename);
    const uploadsDir = path.join(__dirname, '../uploads/');
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      return res.status(404).json({ message: 'Uploads directory not found' });
    }
    
    // Read all files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    // Find file that ends with the original filename
    const actualFile = files.find(file => file.endsWith(originalFilename));
    
    if (!actualFile) {
      return res.status(404).json({ message: `File not found: ${originalFilename}` });
    }
    
    const filePath = path.join(uploadsDir, actualFile);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File path does not exist' });
    }
    
    res.download(filePath, originalFilename);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single call announcement
router.get('/:id', async (req, res) => {
  try {
    const call = await CallAnnouncement.findOne({ id: req.params.id });
    if (!call) {
      return res.status(404).json({ message: 'Call announcement not found' });
    }
    res.json(transformCall(call));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create call announcement with file upload
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    // Parse the call data
    let callData;
    try {
      callData = JSON.parse(req.body.data);
    } catch (parseError) {
      return res.status(400).json({ message: 'Invalid JSON in data field: ' + parseError.message });
    }
    
    // Ensure data object exists
    if (!callData.data) {
      callData.data = {};
    }
    
    // Clean up any non-array attachment field from form data
    // (form might send attachment as a string from file input, which we handle separately)
    if (callData.data.attachment && !Array.isArray(callData.data.attachment)) {
      delete callData.data.attachment;
    }
    
    // If file was uploaded, add it to attachments
    if (req.file) {
      const attachment = {
        fieldId: 'attachment',
        fileName: req.file.originalname,
        fileSize: req.file.size
      };
      
      // Initialize attachment array if it doesn't exist or is not an array
      if (!callData.data.attachment || !Array.isArray(callData.data.attachment)) {
        callData.data.attachment = [];
      }
      callData.data.attachment.push(attachment);
      console.log('File uploaded - Attachment added:', attachment);
      console.log('Call data with attachment:', JSON.stringify(callData, null, 2));
    }
    
    // Validate required fields
    if (!callData.id) {
      return res.status(400).json({ message: 'Call id is required' });
    }
    if (!callData.categoryId) {
      return res.status(400).json({ message: 'Category id is required' });
    }
    if (!callData.title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const call = new CallAnnouncement(callData);
    const newCall = await call.save();
    res.status(201).json(transformCall(newCall));
  } catch (error) {
    console.error('Create call error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${messages}` });
    }
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Call with this id already exists' });
    }
    res.status(400).json({ message: error.message || 'Failed to create call announcement' });
  }
});

// Update call announcement with file upload
router.put('/:id', upload.single('attachment'), async (req, res) => {
  try {
    // Parse the call data
    let callData;
    try {
      callData = JSON.parse(req.body.data);
    } catch (parseError) {
      return res.status(400).json({ message: 'Invalid JSON in data field: ' + parseError.message });
    }
    
    // Get existing call to preserve attachments
    const existingCall = await CallAnnouncement.findOne({ id: req.params.id });
    if (!existingCall) {
      return res.status(404).json({ message: 'Call announcement not found' });
    }
    
    // Ensure data object exists
    if (!callData.data) {
      callData.data = {};
    }
    
    // Clean up any non-array attachment field from form data
    // (form might send attachment as a string from file input)
    if (callData.data.attachment && !Array.isArray(callData.data.attachment)) {
      delete callData.data.attachment;
    }
    
    // If file was uploaded, add it to attachments (preserve existing ones)
    if (req.file) {
      const attachment = {
        fieldId: 'attachment',
        fileName: req.file.originalname,
        fileSize: req.file.size
      };
      
      // Preserve existing attachments if they exist and are an array
      if (existingCall.data && existingCall.data.attachment && Array.isArray(existingCall.data.attachment)) {
        callData.data.attachment = [...existingCall.data.attachment];
      } else {
        // Initialize as empty array if it doesn't exist or is not an array
        if (!callData.data.attachment || !Array.isArray(callData.data.attachment)) {
          callData.data.attachment = [];
        }
      }
      
      // Add new attachment
      callData.data.attachment.push(attachment);
    } else {
      // If no new file, preserve existing attachments
      if (existingCall.data && existingCall.data.attachment && Array.isArray(existingCall.data.attachment)) {
        callData.data.attachment = existingCall.data.attachment;
      } else if (callData.data.attachment && !Array.isArray(callData.data.attachment)) {
        // Remove non-array attachment if it exists
        delete callData.data.attachment;
      }
    }
    
    const call = await CallAnnouncement.findOneAndUpdate(
      { id: req.params.id },
      callData,
      { new: true, runValidators: true }
    );
    
    if (!call) {
      return res.status(404).json({ message: 'Call announcement not found after update' });
    }
    
    res.json(transformCall(call));
  } catch (error) {
    console.error('Update call error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${messages}` });
    }
    res.status(400).json({ message: error.message || 'Failed to update call announcement' });
  }
});


// Delete call announcement
router.delete('/:id', async (req, res) => {
  try {
    const call = await CallAnnouncement.findOneAndDelete({ id: req.params.id });
    if (!call) {
      return res.status(404).json({ message: 'Call announcement not found' });
    }
    res.json({ message: 'Call announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
