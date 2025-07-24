import express from 'express';
import cors from 'cors';
import Mercury from '@postlight/mercury-parser';
import fetch from 'node-fetch';
import { parse as parseContentType } from 'encoding';
import iconv from 'iconv-lite';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/parser', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    // 1) 生のレスポンスを取得（バッファで）
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const buffer = await resp.arrayBuffer();
    const ct = resp.headers.get('content-type') || '';
    
    // 2) Content-Type ヘッダーから charset を抽出
    const match = /charset=([^;]+)/i.exec(ct);
    const charset = match ? match[1].toLowerCase().trim() : 'utf-8';

    // 3) バッファを適切な文字コードでデコード
    const html = iconv.decode(Buffer.from(buffer), charset);

    // 4) Mercury Parser に URL と HTML を渡して解析
    const result = await Mercury.parse(url, { html });

    // 5) 必要なフィールドだけ返却
    res.json({
      title:  result.title  || '',
      author: result.author || '',
      content:result.content|| ''
    });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: 'Failed to parse article.', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
