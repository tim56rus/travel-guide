const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const db = require('./connectdb'); // Adjust the path based on your project structure

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

    // Delete associated files (cover photo and trip photos)
    const userDir = path.join(__dirname, '..', 'uploads', userId.toString());

    const deleteFileIfExists = (url) => {
      if (!url) return;
      const filename = url.split('/').pop();
      const filepath = path.join(userDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`Deleted file: ${filepath}`);
      }
    };

    deleteFileIfExists(trip.coverPhoto);
    if (Array.isArray(trip.photos)) {
      trip.photos.forEach(deleteFileIfExists);
    }

    await db.collection("Trips").deleteOne({
      _id: new ObjectId(tripId),
      userId: userObjectId
    });

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Trip deletion error:", err);
    res.status(500).json({ error: "Failed to delete trip" });
  }
};

module.exports = deleteTrip;
