const db = require("./connectdb");

module.exports = async function searchTripsAPI(req, res) {
  // require authentication
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated", data: null });
  }

  // read params, defaulting `by` to "title"
  const byRaw = String(req.query.by || "title").toLowerCase();
  const q     = req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing ‘q’ parameter", data: null });
  }

  // handle date-range search specially
  if (byRaw === "dates") {
    // normalize query-date (accept any non-digit separator)
    const norm = String(q).replace(/\D+/g, "/");
    const queryDate = new Date(norm);
    if (isNaN(queryDate)) {
      return res.status(400).json({ error: "Invalid date format", data: null });
    }

    try {
      const trips = await db
        .collection("Trips")
        .find({ Owner: userId })
        .toArray();

      const inRange = trips.filter(trip => {
        if (!trip.Dates) return false;
        const [startRaw, endRaw] = String(trip.Dates).split(/\s*-\s*/);
        const start = new Date(startRaw.replace(/\D+/g, "/"));
        const end   = new Date(endRaw  .replace(/\D+/g, "/"));
        if (isNaN(start) || isNaN(end)) return false;
        return queryDate >= start && queryDate <= end;
      });

      return res.status(200).json({ error: "", data: inRange });
    } catch (e) {
      return res.status(500).json({ error: e.toString(), data: null });
    }
  }

  // map other modes to fields
  let field;
  switch (byRaw) {
    case "place": field = "Location"; break;
    case "notes": field = "Notes";    break;
    case "title": field = "Trip";     break;
    default:
      return res.status(400).json({ error: "Invalid search field", data: null });
  }

  // build case‑insensitive regex
  const esc = String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(esc, "i");

  // run the query
  try {
    const data = await db
      .collection("Trips")
      .find({ Owner: userId, [field]: regex })
      .toArray();
    return res.status(200).json({ error: "", data });
  } catch (e) {
    return res.status(500).json({ error: e.toString(), data: null });
  }
};
