// backend/createTrip.js

const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const db = require('./connectdb');
const { upload } = require('./fileManagement');

// POST /api/createTrip
const createTrip = [
  upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });

      const userObjectId = new ObjectId(userId);
      const {
        name,
        location,
        startDate,
        endDate,
        flightInfo,
        journal,
        itinerary
      } = req.body;

      if (!name || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const coverPhoto = req.files?.['coverPhoto']?.[0]?.filename || null;
      const photos = req.files?.['photos']?.map(file => file.filename) || [];

      const baseUrl = `https://lp.poosdisfun.xyz/uploads/${userId}/`;
      const coverPhotoUrl = coverPhoto ? baseUrl + coverPhoto : null;
      const photoUrls = photos.map(filename => baseUrl + filename);

      const trip = {
        userId: userObjectId,
        name,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        flightInfo,
        journal,
        itinerary,
        coverPhoto: coverPhotoUrl,
        photos: photoUrls,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('Trips').insertOne(trip);
      res.status(201).json({ ...trip, _id: result.insertedId });
    } catch (err) {
      console.error('Trip creation error:', err);
      res.status(500).json({ error: 'Failed to create trip' });
    }
  }
];

module.exports = createTrip;
