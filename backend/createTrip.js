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
    { name: 'tripPhotos', maxCount: 10 }
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
	  
	  let itineraryArr = [];
      if (itinerary) {
        try {
          itineraryArr = JSON.parse(itinerary);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid itinerary format' });
        }
      }

      const coverPhoto = req.files?.['coverPhoto']?.[0]?.filename || null;
      const tripPhotos = req.files?.['tripPhotos']?.map(file => file.filename) || [];

      const baseUrl = `/uploads/${userId}/`;
      const coverPhotoUrl = coverPhoto ? baseUrl + coverPhoto : null;
      const photoUrls = tripPhotos.map(filename => baseUrl + filename);

      const trip = {
        owner: userId,
        name,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        flightInfo,
        journal,
        itinerary: itineraryArr,
        coverPhoto: coverPhotoUrl,
        tripPhotos: photoUrls,
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
