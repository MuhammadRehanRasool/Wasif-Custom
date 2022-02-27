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
});

module.exports = mongoose.model("leaveRequests", leaveRequestModel);
