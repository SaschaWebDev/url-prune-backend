const express = require("express");
const router = express.Router();
const isUrl = require("is-url");

const urlServices = require("../services/url-services");

// GET all urls
router.get("/", async (req, res) => {
  try {
    const urls = await urlServices.findAll();
    res.status(200).json({ urls: urls });
  } catch (err) {
    console.log("Error during listing all urls: ", err);
    res.status(500).json({ message: "Error during listing all urls" });
  }
});

// GET url by id
router.get("/:id", async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const url = await urlServices.findByUrlId(id);
    res.status(200).json({ url: url });
  } catch (err) {
    if (err.toString().includes("Cast to ObjectId failed for value")) {
      res.status(404).json({ message: `Url was not found.` });
    } else {
      console.log("Error during listing a specific url: ", err);
      res.status(500).json({ message: "Error during listing a specific url" });
    }
  }
});

// POST create new URL mapping
router.post("/add", async (req, res) => {
  try {
    const parsedUrl = validateURl(req.body.url);

    if (parsedUrl) {
      const foundUrl = await urlServices.findByOriginalUrl(parsedUrl);
      if (foundUrl) {
        return res.status(200).json({ url: foundUrl });
      }

      const newUrl = await urlServices.createUrl(parsedUrl);
      res.status(201).json({ url: newUrl });
    } else {
      res.status(400).json({ message: "Provided url is malformed." });
    }
  } catch (err) {
    console.log("Error during adding a specific url: ", err);
    res.status(500).json({ message: "Error during adding a specific url" });
  }
});

// GET increase view for url by mapped url code
router.get("/viewed/:code", async (req, res) => {
  try {
    const {
      params: { code },
    } = req;

    const updatedUrl = await urlServices.updateUrlView(code);
    if (!updatedUrl) {
      return res
        .status(404)
        .json({ message: `Url mapped to ${code} was not found.` });
    }
    res.status(200).json({ updatedUrl });
  } catch (err) {
    console.log("Error during adding a view to a specific url: ", err);
    res
      .status(500)
      .json({ message: "Error during adding a view to a specific url" });
  }
});

// GET receive a redirct for a given code
router.get("/redirect/:code", async (req, res) => {
  try {
    const {
      params: { code },
    } = req;

    const foundUrl = await urlServices.findByMappedUrl(code);
    if (!foundUrl) {
      return res
        .status(404)
        .json({ message: `Url mapped to ${code} was not found.` });
    }
    await urlServices.updateUrlView(code);
    res.redirect(foundUrl.url);
  } catch (err) {
    console.log("Error during redirecting to a specific url: ", err);
    res
      .status(500)
      .json({ message: "Error during redirecting to a specific url" });
  }
});

// Utilities
function validateURl(given_url) {
  let parsedUrl = given_url;

  if (parsedUrl.includes("www.")) {
    parsedUrl = parsedUrl.replace("www.", "");
  }

  if (parsedUrl.includes("http://")) {
    parsedUrl = parsedUrl.replace("http://", "https://");
  }

  if (!parsedUrl.includes("https://")) {
    parsedUrl = "https://" + parsedUrl;
  }

  if (parsedUrl && isUrl(parsedUrl)) {
    return parsedUrl;
  }
  return null;
}

module.exports = router;
