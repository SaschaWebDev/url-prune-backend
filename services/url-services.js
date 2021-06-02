require("dotenv").config();

const UrlSchema = require("../models/urls.js");

module.exports = {
  findAll,
  findByUrlId,
  findByMappedUrl,
  findByOriginalUrl,
  createUrl,
  updateUrlView,
  getMostRecentPrunes,
};

async function findAll() {
  return await UrlSchema.find();
}

async function findByUrlId(id) {
  return await UrlSchema.findById(id);
}

async function findByMappedUrl(mapped_url) {
  return await UrlSchema.findOne({ mapped_url: mapped_url });
}

async function findLastThreePrunes(recentUserId) {
  return await UrlSchema.find({ recentUserId: recentUserId })
    .sort({
      created_at: "desc",
    })
    .limit(3);
}

async function findByOriginalUrl(url) {
  return await UrlSchema.findOne({ url: url });
}

async function createUrl(given_url, recentUserId) {
  const url = new UrlSchema({
    url: given_url,
    recentUserId: recentUserId,
  });
  return await url.save();
}

async function updateUrlView(mapped_url) {
  let foundUrl = await findByMappedUrl(mapped_url);

  if (!foundUrl) {
    return null;
  }
  foundUrl.last_view = Date.now();
  foundUrl.view_count += 1;

  return await foundUrl.save();
}

async function getMostRecentPrunes(recentUserId) {
  let foundPrunes = await findLastThreePrunes(recentUserId);
  if (!foundPrunes) {
    return null;
  }
  return foundPrunes;
}
