const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function searchTripsAPI(req, res) {
  // require authentication
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated", data: null });
  }

  // read params, defaulting `by` to "name"
  const byRaw = String(req.query.by || "name").toLowerCase();
  const q     = req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing ‘q’ parameter", data: null });
  }

  // handle date‐range search
  if (byRaw === "dates") {
    // accept human‐friendly separators
    const norm = String(q).replace(/\D+/g, "/");
    const queryDate = new Date(norm);
    if (isNaN(queryDate)) {
      return res.status(400).json({ error: "Invalid date format", data: null });
    }

    try {
      const trips = await db
        .collection("Trips")
        .find({ owner: userId })
        .toArray();

      const inRange = trips.filter(trip => {
        if (!trip.startDate || !trip.endDate) return false;
        const start = new Date(trip.startDate);
        const end   = new Date(trip.endDate);
        if (isNaN(start) || isNaN(end)) return false;
        return queryDate >= start && queryDate <= end;
      });

      return res.status(200).json({ error: "", data: inRange });
    } catch (e) {
      return res.status(500).json({ error: e.toString(), data: null });
    }
  }

  // build case‐insensitive regex
  const esc   = String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(esc, "i");

  // build filter for name, location, or combined journal+itinerary
let filter;
if (byRaw === "name") {
  filter = { name: regex };
} else if (byRaw === "location") {
  filter = { location: regex };
} else if (byRaw === "journal") {
  filter = {
    $or: [
      { journal:           regex },
      { "itinerary.day":      regex },
      { "itinerary.morning":  regex },
      { "itinerary.afternoon":regex },
      { "itinerary.evening":  regex },
    ]
  };
} else {
  return res.status(400).json({ error: "Invalid search field", data: null });
}

  // run the query
  try {
    const data = await db
		.collection("Trips")
		.find({ owner: userId, ...filter })
		.toArray();
    return res.status(200).json({ error: "", data });
  } catch (e) {
    return res.status(500).json({ error: e.toString(), data: null });
  }
};
