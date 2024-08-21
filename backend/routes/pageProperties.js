const express = require('express');
const router = express.Router();
const getPageContent = require('../utils/getPageContent');

router.post('/', async (req, res) => {
  const { url, includeUhf = false } = req.body; // Default to false if not provided
  try {
    const $ = await getPageContent(url, includeUhf);
    if (!$) return res.status(500).send('Failed to fetch page content.');

    const metaTags = [];
    $('meta').each((_, meta) => {
      const name = $(meta).attr('name');
      const property = $(meta).attr('property');
      const content = $(meta).attr('content');
      if (name || property) {
        metaTags.push({
          name: name || property,
          content: content || 'No Content',
        });
      }
    });

    res.json({ metaTags });
  } catch (error) {
    console.error('Error in /page-properties route:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
