const express = require('express');
const router = express.Router();
const { generateUpdates } = require('../templates/generator');

router.post('/', (req, res) => {
  try {
    const { shipped, metrics, risks } = req.body;

    // Validation
    const missing = [];
    if (!shipped || shipped.trim() === '') missing.push('shipped');
    if (!metrics || metrics.trim() === '') missing.push('metrics');
    if (!risks   || risks.trim()   === '') missing.push('risks');

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing or empty required fields: ${missing.join(', ')}`
      });
    }

    const result = generateUpdates({
      shipped: shipped.trim(),
      metrics: metrics.trim(),
      risks:   risks.trim()
    });

    return res.status(200).json(result);

  } catch (err) {
    console.error('Error generating updates:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;