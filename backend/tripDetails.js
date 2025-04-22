const express = require('express');
const router = express.Router();
const {upload}  = require('./fileManagement');

// In-memory storage for trips (for testing purposes)
const trips = [];

// Handle trip creation with file uploads
router.post('/trips', upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photos', maxCount: 10 }
]), (req, res) => {
  try {
    // Simulate an authenticated user by assigning a mock userId
    const mockUserId = 'test-user-123';

    const { location, startDate, endDate, notes } = req.body;
    const coverPhoto = req.files['coverPhoto'] ? req.files['coverPhoto'][0].filename : null;
    const photos = req.files['photos'] ? req.files['photos'].map(file => file.filename) : [];

    const baseUrl = 'http://localhost:3500/uploads/';
    const coverPhotoUrl = coverPhoto ? baseUrl + coverPhoto : null;
    const photoUrls = photos.map(filename => baseUrl + filename);

    const trip = {
      id: trips.length + 1,
      userId: mockUserId,
      location,
      dateRange,
      notes,
      coverPhoto: coverPhotoUrl,
      photos: photoUrls,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    trips.push(trip);
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

module.exports = router;
