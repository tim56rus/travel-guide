const db = require("./connectdb");

module.exports = async function loginAPI(req, res) {
  let error = "";
  const { login, password } = req.body;
  // login = either username or email

  try {
    // find user with matching username/email and password
    // regex for case-insensitive matching on username/email
    const results = await db
      .collection("Users")
      .find({
        $or: [
          { Username: { $regex: new RegExp(`^${login}$`, "i") } },
          { Email: { $regex: new RegExp(`^${login}$`, "i") } },
        ],
        Password: password,
      })
      .toArray();

    let id = -1;
    let fn = "";
    let ln = "";
    let userName = "";

    if (results.length > 0) {
      // user found
      id = results[0]._id;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      userName = results[0].Username;
    } else {
      error = "Invalid username/email or password";
    }

    const ret = {
      id: id,
      firstName: fn,
      lastName: ln,
      username: userName,
      error: error,
    };
    res.status(200).json(ret);
  } catch (e) {
    const ret = {
      id: -1,
      firstName: "",
      lastName: "",
      username: "",
      error: e.toString(),
    };
    res.status(500).json(ret);
  }
};