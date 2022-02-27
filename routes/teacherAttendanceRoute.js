const express = require("express");
const router = express.Router();
const teacherAttendanceModel = require("../models/teacherAttendanceModel");

router.post("/insert", (request, responce) => {
  let teacherAttendanceModelObject = new teacherAttendanceModel({
    teacherId: request.body.teacherId,
    date: request.body.date,
    slotId: request.body.slotId,
    status: request.body.status,
    confirmation: request.body.confirmation,
  });
  teacherAttendanceModelObject
    .save()
    .then((callbackData) => {
      responce.json(callbackData);
    })
    .catch((error) => {
      responce.json(error);
    });
});

router.get("/view", (request, responce) => {
  teacherAttendanceModel.find((error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.get("/view/:id", (request, responce) => {
  teacherAttendanceModel.findById(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/delete/:id", (request, responce) => {
  teacherAttendanceModel.findByIdAndDelete(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

module.exports = router;
