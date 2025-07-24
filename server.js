import express from 'express';
import cors from 'cors';
import Mercury from '@postlight/mercury-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/parser', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    // ① まずは node-fetch で生の HTML を取得
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await resp.text();

    // ② Mercury に HTML を直接渡して解析
    const result = await Mercury.parse(url, { html });

    res.json({
      title: result.title || '',
      author: result.author || '',
      content: result.content || ''
    });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: 'Failed to parse article.', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
