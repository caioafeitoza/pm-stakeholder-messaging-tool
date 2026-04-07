const express = require('express');
const cors = require('cors');
const path = require('path');

const generateRoute = require('./backend/routes/generate');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Vite build output
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/generate', generateRoute);

// Catch-all: serve Vite's index.html for any non-API route
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});