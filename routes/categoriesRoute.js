const express = require("express");
const router = express.Router();
const staffAttendanceModel = require("../models/staffAttendanceModel");
const labsModel = require("../models/labsModel");
const usersModel = require("../models/usersModel");

router.post("/insert", (request, responce) => {
  staffAttendanceModel.findOne(
    {
      date: request.body.date,
      staffId: request.body.staffId,
      status: request.body.status,
    },
    (error, data) => {
      if (error) {
        console.log(error);
      }
      if (!data) {
        let staffAttendanceModelObject = new staffAttendanceModel({
          staffId: request.body.staffId,
          date: request.body.date,
          status: request.body.status,
        });
        staffAttendanceModelObject
          .save()
          .then((callbackData) => {
            responce.json(callbackData);
          })
          .catch((error) => {
            responce.json(error);
          });
      } else {
        responce.json({ message: `Already checked ${request.body.status}!` });
      }
    }
  );
});


module.exports = router;