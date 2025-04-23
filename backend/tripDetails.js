// tripDetails.js

const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const db = require('./connectdb');
const { upload } = require('./fileManagement');

// POST /api/trips
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
      const { location, dateRange, notes } = req.body;

      const coverPhoto = req.files?.['coverPhoto']?.[0]?.filename || null;
      const photos = req.files?.['photos']?.map(file => file.filename) || [];

      const baseUrl = `http://54.196.120.115:5000/uploads/${userId}/`;
      const coverPhotoUrl = coverPhoto ? baseUrl + coverPhoto : null;
      const photoUrls = photos.map(filename => baseUrl + filename);

      const trip = {
        userId: userObjectId,
        location,
        dateRange,
        notes,
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

// GET /api/trips
const getTrips = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    const userObjectId = new ObjectId(userId);
    const trips = await db.collection('Trips')
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(trips);
  } catch (err) {
    console.error('Trip fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve trips' });
  }
};

// DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userObjectId = new ObjectId(userId);
    const tripId = req.params.id;

    if (!ObjectId.isValid(tripId)) {
      return res.status(400).json({ error: "Invalid trip ID" });
    }

    const trip = await db.collection("Trips").findOne({
      _id: new ObjectId(tripId),
      userId: userObjectId
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found or unauthorized" });
    }

    // Delete associated files
    const userDir = path.join(__dirname, 'uploads', userId.toString());
    const deleteFileIfExists = (url) => {
      if (!url) return;
      const filename = url.split('/').pop();
      const filepath = path.join(userDir, filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    };

    deleteFileIfExists(trip.coverPhoto);
    if (Array.isArray(trip.photos)) trip.photos.forEach(deleteFileIfExists);

    const result = await db.collection("Trips").deleteOne({
      _id: new ObjectId(tripId),
      userId: userObjectId
    });

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Trip deletion error:", err);
    res.status(500).json({ error: "Failed to delete trip" });
  }
};

// PUT /api/trips/:id
const updateTrip = [
  upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "User not authenticated" });

      const userObjectId = new ObjectId(userId);
      const tripId = req.params.id;

      if (!ObjectId.isValid(tripId)) {
        return res.status(400).json({ error: "Invalid trip ID" });
      }

      const existingTrip = await db.collection("Trips").findOne({
        _id: new ObjectId(tripId),
        userId: userObjectId
      });

      if (!existingTrip) {
        return res.status(404).json({ error: "Trip not found or unauthorized" });
      }

      const { location, dateRange, notes } = req.body;
      const updates = {};

      if (location) updates.location = location;
      if (dateRange) updates.dateRange = dateRange;
      if (notes) updates.notes = notes;

      const baseUrl = `http://54.196.120.115:5000/uploads/${userId}/`;
      const coverPhoto = req.files?.['coverPhoto']?.[0]?.filename;
      const photos = req.files?.['photos']?.map(file => file.filename);

      if (coverPhoto) updates.coverPhoto = baseUrl + coverPhoto;
      if (photos && photos.length > 0) updates.photos = photos.map(name => baseUrl + name);

      updates.updatedAt = new Date();

      const result = await db.collection("Trips").findOneAndUpdate(
        { _id: new ObjectId(tripId), userId: userObjectId },
        { $set: updates },
        { returnDocument: 'after' }
      );

      res.status(200).json(result.value);
    } catch (err) {
      console.error("Trip update error:", err);
      res.status(500).json({ error: "Failed to update trip" });
    }
  }
];

// DELETE /api/photo/:tripId/:filename
const deleteTripPhoto = async (req, res) => {
  try {
    const { tripId, filename } = req.params;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    if (!filename || !tripId) return res.status(400).json({ error: "Missing data" });

    const userObjectId = new ObjectId(userId);
    const trip = await db.collection("Trips").findOne({
      _id: new ObjectId(tripId),
      userId: userObjectId
    });

    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const baseUrl = `http://54.196.120.115:5000/uploads/${userId}/`;
    const fullUrl = baseUrl + filename;

    // Remove from DB array
    const updatedPhotos = trip.photos.filter(p => p !== fullUrl);
    await db.collection("Trips").updateOne(
      { _id: new ObjectId(tripId) },
      { $set: { photos: updatedPhotos, updatedAt: new Date() } }
    );

    // Delete file from disk
    const filepath = path.join(__dirname, 'uploads', userId.toString(), filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Photo deletion error:", err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
};


module.exports = {
  createTrip,
  getTrips,
  deleteTrip,
  updateTrip,
  deleteTripPhoto
};
