module.exports = function logoutAPI(req, res) {
  // destroy server‑side session
  req.session.destroy(err => {
    if (err) {
      console.error("Session destroy error:", err);
      // even if destroy fails, clear the cookie on the client
      res.clearCookie("connect.sid");
      return res.status(500).json({ error: "Could not log out." });
    }
    // clear the cookie in the browser
    res.clearCookie("connect.sid");
    res.status(200).json({ success: "Logged out successfully." });
  });
});