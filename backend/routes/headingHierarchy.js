const express = require('express');
const router = express.Router();
const getPageContent = require('../utils/getPageContent');

router.post('/', async (req, res) => {
  const { url, includeUhf } = req.body;
  const $ = await getPageContent(url, includeUhf);
  if (!$) return res.status(500).send('Failed to fetch page content.');

  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((_, heading) => {
    headings.push({
      level: heading.tagName,
      text: $(heading).text().trim(),
    });
  });

  res.json({ headings });
});

module.exports = router;
