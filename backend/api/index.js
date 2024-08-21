const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
const router = express.Router();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Route imports
const extractUrls = require('./routes/extractUrls');
const linkDetails = require('./routes/linkDetails');
const imageDetails = require('./routes/imageDetails');
const videoDetails = require('./routes/videoDetails');
const pageProperties = require('./routes/pageProperties');
const headingHierarchy = require('./routes/headingHierarchy');

// Route use
router.use('/extract-urls', extractUrls);
router.use('/link-details', linkDetails);
router.use('/image-details', imageDetails);
router.use('/video-details', videoDetails);
router.use('/page-properties', pageProperties);
router.use('/heading-hierarchy', headingHierarchy);

app.use('/api', router);

module.exports.handler = serverless(app);
