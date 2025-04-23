// backend/logout.js
module.exports = function logoutAPI(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error("Session destroy error:", err);
      // even if destroy fails, we still clear the cookie
    }
    // clear the cookie on the client — path must match your session cookie’s path
    res.clearCookie("connect.sid", { path: "/" });
    // 200 is fine here
    return res.status(200).json({ success: "Logged out successfully." });
  });
};
