const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const videoDetails = await page.evaluate(() => {
    const videoDetailsList = [];
    const videoElements = document.querySelectorAll("universal-media-player");

    videoElements.forEach(videoElement => {
      const options = JSON.parse(videoElement.getAttribute("options"));
      const audioTrackPresent = videoElement.querySelector('.vjs-main-desc-menu-item') ? "yes" : "no";
      const videoDetail = {
        transcript: options.downloadableFiles
          .filter(file => file.mediaType === "transcript")
          .map(file => file.locale),
        cc: options.ccFiles.map(file => file.locale),
        autoplay: options.autoplay ? "yes" : "no",
        muted: options.muted ? "yes" : "no",
        ariaLabel: options.ariaLabel || options.title || "",
        audioTrack: audioTrackPresent,
      };

      videoDetailsList.push(videoDetail);
    });

    return videoDetailsList;
  });

  await browser.close();
  res.json({ videos: videoDetails });
});

module.exports = router;
