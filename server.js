const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from repo root
app.use(express.static(path.resolve(__dirname)));

// Simple proxy to controllers.json to avoid CORS while developing
app.get('/proxy/controllers.json', async (req, res) => {
  try {
    const upstream = 'https://live.env.vnas.vatsim.net/data-feed/controllers.json';
    const resp = await fetch(upstream, { timeout: 10000 });
    const body = await resp.text();
    // forward status and content-type
    res.status(resp.status);
    const ctype = resp.headers.get('content-type') || 'application/json';
    res.set('Content-Type', ctype);
    res.send(body);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(502).json({ error: 'Bad Gateway', message: err.message });
  }
});

// Allow saving overrides.json from the in-page editor (development only)
app.use(express.json({ limit: '100kb' }));
app.post('/overrides', async (req, res) => {
  try {
    const overrides = req.body;
    if(!overrides || typeof overrides !== 'object') return res.status(400).json({ error: 'Invalid payload' });
    const fs = require('fs');
    const p = path.resolve(__dirname, 'overrides.json');
    fs.writeFileSync(p, JSON.stringify(overrides, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) {
    console.error('Save overrides error', err);
    res.status(500).json({ error: 'Could not save overrides', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Static server + proxy listening on http://localhost:${PORT}`);
});
