const mongoose = require("mongoose");

const WhiteboardSchema = new mongoose.Schema({
  room: String,
  username: String,
  strokes: Array,
});

module.exports = mongoose.model("Whiteboard", WhiteboardSchema);