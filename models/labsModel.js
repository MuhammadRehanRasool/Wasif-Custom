const mongoose = require("mongoose");

const labsModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cameraIp: {
    type: String,
  },
  controller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("labs", labsModel);
