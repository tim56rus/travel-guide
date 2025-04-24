const db = require("./connectdb");
const { ObjectId } = require("mongodb");

module.exports = async function accountUpdateAPI(req, res) {
  let error = "";
  let success = "";

  // Destructure the fields from the request body.
  // Here we assume that userId is provided (e.g., from client input or session middleware)
  const { userId, username, email, firstName, lastName, password, newPassword, confirmNewPassword, profilePic } = req.body;

  // Validate required account fields.
  if (!userId || !username || !email || !firstName || !lastName) {
    error = "All account fields (userId, username, email, firstName, lastName) are required.";
    return res.status(200).json({ error, success });
  }

  // Helper function to convert strings to Title Case.
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Determine if a password update is attempted.
  let updatePassword = false;
  if (
    (password && password.trim() !== "") ||
    (newPassword && newPassword.trim() !== "") ||
    (confirmNewPassword && confirmNewPassword.trim() !== "")
  ) {
    updatePassword = true;
  }

  // If updating the password, validate that all password fields are provided and correct.
  if (updatePassword) {
    if (!password || !newPassword || !confirmNewPassword) {
      error = "All password fields (password, newPassword, and confirmNewPassword) are required when updating the password.";
      return res.status(200).json({ error, success });
    }
    if (newPassword !== confirmNewPassword) {
      error = "New password and confirmation do not match.";
      return res.status(200).json({ error, success });
    }
  }

  try {
    // Access the Users collection.
    const users = db.collection("Users");

    // Find the user by userId.
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      error = "User not found.";
      return res.status(200).json({ error, success });
    }

    // Build the update object with fields mapped to your database keys.
    const updateData = {
      Username: username,
      Email: email.toLowerCase(),
      FirstName: toTitleCase(firstName),
      LastName: toTitleCase(lastName)
    };

    // If a password update is requested, verify the current password and update it.
    // Note: This example uses a plain text comparison, similar to your login endpoint.
    if (updatePassword) {
      if (password !== user.Password) {
        error = "Current password is incorrect.";
        return res.status(200).json({ error, success });
      }
      updateData.Password = newPassword;
    }
	
	// Update profile pic
	if (profilePic && typeof profilePic === "string") {
      updateData.ProfilePic = profilePic;
    }

    // Update the user record.
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      error = "User not found.";
      return res.status(200).json({ error, success });
    }

    success = "Account info updated successfully.";
    return res.status(200).json({ error, success });
  } catch (e) {
    return res.status(200).json({ error: e.toString(), success: "" });
  }
};