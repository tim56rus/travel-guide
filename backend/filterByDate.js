const db = require("./connectdb");

module.exports = async function filterByDateAPI(req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated", data: null });
  }

  // parse comma-separated filters from query (e.g. "past,current")
  const raw = String(req.query.filter || "");
  const filters = raw.split(",").filter(Boolean);

  try {
    const all = await db.collection("Trips").find({ Owner: userId }).toArray();

    // no filters => send everything
    if (filters.length === 0) {
      return res.status(200).json({ error: "", data: all });
    }

    // helper to parse "6/30/2025-7/15/2025" → [Date,Date]
    const parseRange = (s) => {
      const [a, b] = s.split(/\s*-\s*/).map((x) => x.replace(/\D+/g, "/"));
      return [new Date(a), new Date(b)];
    };
    const now = new Date();

    // keep only trips matching any selected bucket
    const data = all.filter((t) => {
      if (!t.Dates) return false;
      const [start, end] = parseRange(t.Dates);
      if (filters.includes("past") && end < now) return true;
      if (filters.includes("current") && start <= now && now <= end)
        return true;
      if (filters.includes("future") && start > now) return true;
      return false;
    });

    return res.status(200).json({ error: "", data });
  } catch (e) {
    return res.status(500).json({ error: e.toString(), data: null });
  }
};
