// backend/accountDelete.js
const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function accountDeleteAPI(req, res) {
  // ← pull userId out of the server‐side session
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated", success: "" });
  }

  try {
    const users = db.collection("Users");
    const result = await users.deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found", success: "" });
    }

    // Optionally clear their session so they’re fully logged out:
    // req.session.destroy();

    return res.json({ error: "", success: "Account deleted successfully." });
  } catch (e) {
    return res.status(500).json({ error: e.toString(), success: "" });
  }
};
