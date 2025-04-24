const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function searchTripsAPI(req, res) {
  // require authentication
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated", data: null });
  }

  // read params, defaulting `by` to "all" (search across all fields)
  const byRaw = req.query.by
    ? String(req.query.by).toLowerCase()
    : "all";
  const q = String(req.query.q || "").trim();
  // if no query string, return *all* trips for this user
  if (!q) {
    try {
      const all = await db
        .collection("Trips")
        .find({ owner: userId })
        .toArray();
      return res.status(200).json({ error: "", data: all });
    } catch (e) {
      return res.status(500).json({ error: e.toString(), data: null });
    }
  }
  
   if (byRaw === "id" || byRaw === "_id") {
    let oid;
    try {
      oid = new ObjectId(q);
    } catch {
      return res
        .status(400)
        .json({ error: "Invalid ID format", data: null });
    }
    try {
      const data = await db
        .collection("Trips")
        .find({ owner: userId, _id: oid })
        .toArray();
      return res.status(200).json({ error: "", data });
    } catch (e) {
      return res.status(500).json({ error: e.toString(), data: null });
    }
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

 // build filter
  let filter;
  if (byRaw === "all") {
    // search across name, location, journal and all itinerary fields
    filter = {
      $or: [
        { name: regex },
        { location: regex },
        { journal: regex },
        { "itinerary.day": regex },
        { "itinerary.morning": regex },
        { "itinerary.afternoon": regex },
        { "itinerary.evening": regex },
      ]
    };
} else if (byRaw === "name") {
    filter = { name: regex };
  } else if (byRaw === "location") {
    filter = { location: regex };
  } else if (byRaw === "journal") {
    filter = {
      $or: [
        { journal: regex },
        { "itinerary.day": regex },
        { "itinerary.morning": regex },
        { "itinerary.afternoon": regex },
        { "itinerary.evening": regex },
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
