module.exports = function checkSessionAPI(req, res) {
  // if req.session.userId exists, return it; otherwise return {}
  if (req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.json({});
  }
};