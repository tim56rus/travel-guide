const db = require("./connectdb");

module.exports = async function signupAPI(req, res) {
  let error = "";
  let success = "";

  // destructure fields from the sign up form
  const { firstName, lastName, username, email, password } = req.body;

  // helper function to convert strings to Title Case
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  try {
    // check if the username or email already exists
    const existingUser = await db.collection("Users").findOne({
      $or: [
        { Username: { $regex: new RegExp(`^${username}$`, "i") } },
        { Email: { $regex: new RegExp(`^${email}$`, "i") } },
      ],
    });

    if (existingUser) {
      // if user found, set error message
      error = "Username or Email already exists.";
    } else {
      // otherwise, create a new user
      // convert firstName and lastName to title case, email to lower case
      const newUser = {
        FirstName: toTitleCase(firstName),
        LastName: toTitleCase(lastName),
        Username: username,
        Email: email.toLowerCase(),
        Password: password,
		ProfilePic: ""
      };

      await db.collection("Users").insertOne(newUser);
      success = "Account created successfully!";
    }

    const ret = { error: error, success: success };
    res.status(200).json(ret);
  } catch (e) {
    const ret = {
      error: e.toString(),
      success: "",
    };

    res.status(200).json(ret);
  }
};