const express = require('express');
const Mercury = require('@postlight/mercury-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/parse', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  try {
    const result = await Mercury.parse(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse URL', detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});