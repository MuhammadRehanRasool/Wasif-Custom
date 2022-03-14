const mongoose = require("mongoose");

const dailyEquipmentReportModel = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  problemDomain: {
    type: JSON,
    required: true,
  },
  problemWithHardware: {
    type: String,
    required: true,
  },
  problemWithSoftware: {
    type: String,
    required: true,
  },
  problemWithNetworking: {
    type: String,
    required: true,
  },
  problemWithOtherEquipment: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "dailyEquipmentReport",
  dailyEquipmentReportModel
);
