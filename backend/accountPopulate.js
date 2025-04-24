const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function accountPopulateAPI(req, res) {
  // 1) Get userId from session
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated.", data: null });
  }

  try {
    // 2) Fetch only the fields we care about
    const user = await db
      .collection("Users")
      .findOne(
        { _id: new ObjectId(userId) }
      );

    if (!user) {
      return res.status(404).json({ error: "User not found.", data: null });
    }

    // 3) Map to lowercase keys for the client
    const userData = {
      userId:    user._id.toString(),
      username:  user.Username,
      firstName: user.FirstName,
      lastName:  user.LastName,
      email:     user.Email,
	  profilePic: user.ProfilePic,
    };

    return res.status(200).json({ error: "", data: userData });
  } catch (e) {
    console.error("accountPopulateAPI error:", e);
    return res.status(500).json({ error: e.toString(), data: null });
  }
};
