// backend/createTrip.js

const db = require('./connectdb'); // adjust path to your MongoDB connection module

/**
 * Handler for POST /api/createTrip
 * Creates a new trip document for the authenticated user.
 */
module.exports = async (req, res) => {
  try {
    // Ensure the user is authenticated via session
    const ownerId = req.session.userId;
    if (!ownerId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Destructure and validate trip data
    const {
      name,
      location,
      startDate,
      endDate,
      flightInfo,
      journal,
      coverPhoto,
      tripPhotos,
      itinerary,
    } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build the trip document
    const tripDoc = {
      owner: ownerId,
      name,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      flightInfo,
      journal,
      coverPhoto,
      tripPhotos,
      itinerary,
      createdAt: new Date(),
    };

    // Insert into the Trips collection
    const { insertedId } = await db.collection('Trips').insertOne(tripDoc);

    // Respond with the new trip ID
    res.status(201).json({ tripId: insertedId });
  } catch (err) {
    console.error('Error creating trip:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
