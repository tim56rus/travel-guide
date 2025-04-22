const db = require("./connectdb");

module.exports = async function searchTripsAPI(req, res) {
  // make sure we have a logged‑in user
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated", data: null });
  }

  // grab query params
  const { by, q } = req.query;
  if (!by || !q) {
    return res
      .status(400)
      .json({ error: "Missing ‘by’ or ‘q’ parameter", data: null });
  }

  // map your “by” option to the actual Trips field
  let field;
  switch (by) {
    case "place":
      field = "Location";
      break;
    case "notes":
      field = "Notes";
      break;
    case "title":
      field = "Trip";
      break;
    default:
      return res
        .status(400)
        .json({ error: "Invalid search field", data: null });
  }

  // build a case‑insensitive regex search
  const regex = new RegExp(q, "i");

  try {
    const trips = await db
      .collection("Trips")
      .find({
        Owner: userId,
        [field]: regex,
      })
      .toArray();

    res.status(200).json({ error: "", data: trips });
  } catch (e) {
    res.status(500).json({ error: e.toString(), data: null });
  }
};
