const mongoose = require("mongoose");

const leaveRequestModel = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  confirmation1: {
    type: Boolean,
    required: true,
  },
  confirmation2: {
    type: Boolean,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("leaveRequests", leaveRequestModel);
