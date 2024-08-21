const axios = require('axios');
const getStatusColor = require('./getStatusColor');

const processLink = async (link, $) => {
  const href = $(link).attr('href');
  const text = $(link).text().trim();
  const ariaLabel = $(link).attr('aria-label');
  const target = $(link).attr('target');
  const classNames = $(link).attr('class') || '';
  let linkType = 'unknown';

  if (classNames.includes('cta')) {
    linkType = 'cta';
  } else if (classNames.includes('button')) {
    linkType = 'button';
  } else if (classNames.includes('link')) {
    linkType = 'link';
  }

  let linkDetails = {
    linkType: linkType,
    linkText: text,
    ariaLabel: ariaLabel || '',
    url: href,
    redirectedUrl: '',
    statusCode: 200,
    target: target || '',
    statusColor: 'green', // Default color
    originalUrlColor: '',
    redirectedUrlColor: '',
  };

  if (href) {
    try {
      const response = await axios.get(href);
      linkDetails.statusCode = response.status;
      linkDetails.redirectedUrl = response.request.res.responseUrl;
      linkDetails.statusColor = getStatusColor(response.status);

      if (href !== linkDetails.redirectedUrl) {
        linkDetails.originalUrlColor = 'blue';
        linkDetails.redirectedUrlColor = 'purple';
      }
    } catch (error) {
      if (error.response) {
        linkDetails.statusCode = error.response.status;
        linkDetails.statusColor = getStatusColor(error.response.status);
      }
    }
  }

  return linkDetails;
};

module.exports = processLink;
