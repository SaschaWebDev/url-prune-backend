const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
// ~3 years needed, in order to have a 1% probability of at least one collision. https://zelark.github.io/nano-id-cc/
const nanoid = customAlphabet("234569abcefghjkprstuvwxyz", 9);

const urlsSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  mapped_url: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(),
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  last_view: {
    type: Date,
    required: true,
    default: Date.now,
  },
  view_count: {
    type: Number,
    required: true,
    default: 0,
  },
  recentUserId: {
    type: String,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Url", urlsSchema);
