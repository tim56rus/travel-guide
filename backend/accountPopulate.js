const db = require("./connectdb");
const { ObjectId } = require("mongodb");

 module.exports = async function accountPopulateAPI(req, res) {
  const { userId } = req.params;

  try {
    const user = await db.collection("Users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Prepare user data without sensitive fields like password
    const userData = {
      userId: user._id,
      username: user.Username,
      email: user.Email,
      firstName: user.FirstName,
      lastName: user.LastName,
    };

    res.status(200).json({ error: "", data: userData });
  } catch (e) {
    res.status(500).json({ error: e.toString(), data: null });
  }
};