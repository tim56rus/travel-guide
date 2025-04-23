// backend/createTrip.js
const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function createTripAPI(req, res) {
  let error = "";
  let success = "";

  // Ensure the user is logged in
  const ownerId = req.session?.userId;
  if (!ownerId) {
    return res.status(401).json({ error: "Not authenticated.", success: "" });
  }

  // Destructure fields from req.body
  const {
    name,
    startDate,
    endDate,
    flightInfo,
    journal,
    image,
    tripPhotos,
    itinerary,
  } = req.body;

  try {
    // Build the new trip document
    const newTrip = {
      Owner:     new ObjectId(ownerId),         // <-- session-based owner
      Name:      name,
      StartDate: startDate,
      EndDate:   endDate,
      FlightInfo: flightInfo,
      Journal:   journal,
      Image:     image || "",
      TripPhotos: Array.isArray(tripPhotos) ? tripPhotos : [],
      Itinerary:  Array.isArray(itinerary)   ? itinerary   : [],
      CreatedAt: new Date(),
    };

    // Insert into MongoDB
    const result = await db.collection("Trips").insertOne(newTrip);

    success = "Trip created successfully!";
    return res.status(200).json({
      error,
      success,
      tripId: result.insertedId.toString(),
    });
  } catch (e) {
    console.error("createTripAPI error:", e);
    return res.status(500).json({ error: e.toString(), success: "" });
  }
};
