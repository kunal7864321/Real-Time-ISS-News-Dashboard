import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 7860;

app.use(cors());

// Proxy for ISS API
app.get('/api/iss/*', async (req, res) => {
  try {
    const apiPath = req.params[0];
    const targetUrl = `http://api.open-notify.org/${apiPath}`;
    const response = await axios.get(targetUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error for ISS:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Proxy for OSM Nominatim Geocoding API
app.get('/api/geo/*', async (req, res) => {
  try {
    const apiPath = req.params[0];
    const queryString = new URLSearchParams(req.query).toString();
    const targetUrl = `https://nominatim.openstreetmap.org/${apiPath}?${queryString}`;
    const response = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'NexusDashboard/1.0' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error for GEO:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Serve static files from Vite build output directory (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other requests to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
