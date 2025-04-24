const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function tripDeleteAPI(req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing trip ID" });
  }

  let oid;
  try {
    oid = new ObjectId(id);
  } catch {
    return res.status(400).json({ error: "Invalid trip ID format" });
  }

  try {
    // match _id plus the lowercase 'owner' string field
    const result = await db
      .collection("Trips")
      .deleteOne({ _id: oid, owner: userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Trip not found or not owned by you." });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("tripDeleteAPI error:", e);
    return res.status(500).json({ error: "Server error." });
  }
};
