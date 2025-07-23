const express = require('express');
const Mercury = require('@postlight/mercury-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Mercury Parser API is running!');
});

app.get('/parser', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const result = await Mercury.parse(url);
    res.json(result);
  } catch (error) {
    console.error('Error parsing URL:', error);
    res.status(500).json({ error: 'Failed to parse the article' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
