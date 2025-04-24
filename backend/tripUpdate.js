// backend/tripUpdate.js

const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function tripUpdateAPI(req, res) {
  let error = "";
  let success = "";

  // require auth
  const userId = req.session.userId;
  if (!userId) {
    return res.status(200).json({ error: "Not authenticated.", success });
  }

  // pull fields out of the body
  const {
    id,            // the trip’s ObjectId string
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

  // basic validation
  if (!id || !name || !location || !startDate || !endDate) {
    error = "Fields id, name, location, startDate and endDate are required.";
    return res.status(200).json({ error, success });
  }

  // ensure valid ObjectId
  let oid;
  try {
    oid = new ObjectId(id);
  } catch {
    error = "Invalid trip ID format.";
    return res.status(200).json({ error, success });
  }

  try {
    // only let owner update
    const trip = await db
      .collection("Trips")
      .findOne({ _id: oid, owner: userId });

    if (!trip) {
      error = "Trip not found or not owned by you.";
      return res.status(200).json({ error, success });
    }

    // build the update
    const updateData = {
      name:       name,
      location:   location,
      startDate:  new Date(startDate),
      endDate:    new Date(endDate),
      flightInfo: flightInfo,
      journal:    journal,
      coverPhoto: coverPhoto || "",
      tripPhotos: Array.isArray(tripPhotos) ? tripPhotos : [],
      itinerary:  Array.isArray(itinerary) ? itinerary : [],
      updatedAt:  new Date(),
    };

    // perform update
    await db
      .collection("Trips")
      .updateOne(
        { _id: oid },
        { $set: updateData }
      );

    success = "Trip updated successfully.";
    return res.status(200).json({ error, success });
  } catch (e) {
    console.error("tripUpdateAPI error:", e);
    return res.status(200).json({ error: e.toString(), success: "" });
  }
};
