const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;  // Dynamic port for cloud deployment

app.use(express.json());
app.use(cors());

// Route imports
const extractUrls = require('./routes/extractUrls');
const linkDetails = require('./routes/linkDetails');
const imageDetails = require('./routes/imageDetails');
const videoDetails = require('./routes/videoDetails');
const pageProperties = require('./routes/pageProperties');
const headingHierarchy = require('./routes/headingHierarchy');
const allDetails = require('./routes/allDetails');

// Route use
app.use('/extract-urls', extractUrls);
app.use('/link-details', linkDetails);
app.use('/image-details', imageDetails);
app.use('/video-details', videoDetails);
app.use('/page-properties', pageProperties);
app.use('/heading-hierarchy', headingHierarchy);
app.use('/all-details', allDetails);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


