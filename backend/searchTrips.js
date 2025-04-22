const db = require("./connectdb");

module.exports = async function searchTripsAPI(req, res) {
  // require login
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated", data: null });
  }

  // read params
  const { by, q } = req.query;
  if (!by || !q) {
    return res.status(400).json({ error: "Missing ‘by’ or ‘q’ parameter", data: null });
  }

  // DATE RANGE SEARCH
  if (by === "dates") {
    // normalize input to mm/dd/yyyy
    const norm = String(q).replace(/\D+/g, "/");   
    const queryDate = new Date(norm);
    if (isNaN(queryDate)) {
      return res.status(400).json({ error: "Invalid date format", data: null });
    }

    try {
      // grab all this user's trips
      const trips = await db
        .collection("Trips")
        .find({ Owner: userId })
        .toArray();

      // filter to only those whose Dates range includes queryDate
      const inRange = trips.filter(trip => {
        if (!trip.Dates) return false;

        // split on the dash between start/end
        const [startRaw, endRaw] = String(trip.Dates).split(/\s*-\s*/);
        if (!startRaw || !endRaw) return false;

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

  // PLACE / NOTES / TITLE search via regex
  let field;
  switch (by) {
    case "place": field = "Location"; break;
    case "notes": field = "Notes";    break;
    case "title": field = "Trip";     break;
    default:
      return res.status(400).json({ error: "Invalid search field", data: null });
  }

  // escape user input for regex, then case‑insensitive
  const esc = String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(esc, "i");

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
