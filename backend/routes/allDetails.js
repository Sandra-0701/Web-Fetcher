const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const getStatusColor = require('../utils/getStatusColor'); 
const processLink = require('../utils/processLink'); 

const fetchLinkDetails = async ($) => {
  const links = $('a[href]').toArray();
  const linkDetails = await Promise.all(links.map(link => processLink(link, $)));
  return linkDetails;
};

const fetchImageDetails = ($) => {
  const images = $('img').toArray();
  return images.map(img => ({
    imageName: $(img).attr('src'),
    alt: $(img).attr('alt') || ''
  }));
};

const fetchVideoDetails = ($) => {
  const videos = $('video').toArray();
  return videos.map(video => ({
    transcript: $(video).attr('data-transcript') || '',
    cc: $(video).attr('data-cc') || '',
    autoplay: $(video).attr('autoplay') ? 'Yes' : 'No',
    muted: $(video).attr('muted') ? 'Yes' : 'No',
    ariaLabel: $(video).attr('aria-label') || '',
    audioTrack: $(video).find('track').length > 0 ? 'Yes' : 'No'
  }));
};

const fetchPageProperties = ($) => {
  const metaTags = $('meta').toArray();
  return metaTags.map(meta => ({
    name: $(meta).attr('name') || $(meta).attr('property'),
    content: $(meta).attr('content') || ''
  }));
};

const fetchHeadingHierarchy = ($) => {
  const headings = [];
  for (let i = 1; i <= 6; i++) {
    $(`h${i}`).each((_, heading) => {
      headings.push({
        level: i,
        text: $(heading).text().trim()
      });
    });
  }
  return headings;
};

// Function to get page content and parse it
const getPageContent = async (url) => {
  try {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  } catch (error) {
    console.error('Failed to fetch page content:', error);
    return null;
  }
};

// Route to fetch all details
router.post('/', async (req, res) => {
  const { url } = req.body;
  const $ = await getPageContent(url);

  if (!$) return res.status(500).send('Failed to fetch page content.');

  try {
    const [linkDetails, imageDetails, videoDetails, pageProperties, headingHierarchy] = await Promise.all([
      fetchLinkDetails($),
      fetchImageDetails($),
      fetchVideoDetails($),
      fetchPageProperties($),
      fetchHeadingHierarchy($),
    ]);

    res.json({
      links: linkDetails,
      images: imageDetails,
      videos: videoDetails,
      pageProperties: pageProperties,
      headings: headingHierarchy,
    });
  } catch (error) {
    res.status(500).send('Failed to process page content.');
  }
});

module.exports = router;
