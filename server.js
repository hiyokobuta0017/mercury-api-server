const express = require('express');
const Mercury = require('@postlight/mercury-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// CORSを許可（必要に応じて）
app.use(cors());

app.get('/', (req, res) => {
  res.send('Mercury Parser API is running!');
});

// /parser?url=... に対応
app.get('/parser', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const result = await Mercury.parse(url);
    res.json(result);
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: 'Failed to parse the article' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
