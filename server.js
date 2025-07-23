import express from 'express';
import cors from 'cors';
import Mercury from '@postlight/mercury-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/parser', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // Mercury Parserで記事取得
    const result = await Mercury.parse(url, { contentType: 'html' });

    const title = result.title || 'No title';
    const author = result.author || 'No author';
    const content = result.content || 'No content';

    res.json({ title, author, content });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: 'Failed to parse article.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
