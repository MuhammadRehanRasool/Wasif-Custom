const express = require("express");
const router = express.Router();
const teacherAttendanceModel = require("../models/teacherAttendanceModel");

router.post("/insert", (request, responce) => {
  teacherAttendanceModel.findOne(
    {
      date: request.body.date,
      teacherId: request.body.teacherId,
      slotId: request.body.slotId,
    },
    (error, data) => {
      if (error) {
        console.log(error);
      }
      if (!data) {
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
      } else {
        responce.json({ message: "Attendance Already Marked!" });
      }
    }
  );
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
  teacherAttendanceModel
    .find({ teacherId: request.params.id })
    .populate({
      path: "slotId",
      populate: {
        path: "labId",
        model: "labs",
      },
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one, i) => {
            return {
              date: one.date,
              name: one.slotId.labId.name,
              subjectName: one.slotId.subjectName,
              status: one.status,
              confirmation: one.confirmation,
              createdAt: one.createdAt,
            };
          })
        );
      }
    });
});

router.post("/checkSlotAttendance", (request, responce) => {
  let slots = request.body.slots;
  let date = request.body.date;
  let teacherId = request.body.teacherId;
  teacherAttendanceModel.find(
    { date: date, teacherId: teacherId },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        if (data) {
          slots.map((one, i) => {
            let status = false;
            data.map((two, j) => {
              if (one._id === two.slotId.toString()) {
                status = true;
              }
            });
            slots[i].status = status;
          });
          responce.json(slots);
        }
      }
    }
  );
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
