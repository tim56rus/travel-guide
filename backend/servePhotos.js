// backend/servePhotos.js

const path = require('path');
const fs   = require('fs');

const uploadRoot = path.join(__dirname, 'uploads');

module.exports = function servePhotosAPI(req, res) {
  const { userId, photoName } = req.params;
  const filePath = path.join(uploadRoot, userId, photoName);

  // ─── ADD THIS FOR DEBUGGING ─────────────────────
  console.log("servePhotos: looking for file at:", filePath);
  // ────────────────────────────────────────────────

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: 'File not found.',
      tried: filePath      // <<< temporarily send it back in JSON
    });
  }

  res.sendFile(filePath, err => {
    if (err) {
      console.error("Error sending file:", err);
      if (!res.headersSent) res.status(500).json({ error: 'Failed to send.' });
    }
  });
};
