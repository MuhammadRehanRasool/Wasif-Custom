const express = require("express");
const router = express.Router();
const timetableModel = require("../models/timetableModel");

router.post("/insert", (request, responce) => {
  let slots = request.body.slots;
  let sendBack = [];
  slots.map((item, i) => {
    timetableModel.findOne(
      {
        labId: request.body.labId,
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
      },
      (error, data) => {
        if (error) {
          console.log(error);
        }
        if (!data) {
          let timetableModelObject = new timetableModel({
            labId: request.body.labId,
            day: item.day,
            startTime: item.startTime,
            endTime: item.endTime,
            subjectName: item.subjectName,
            teacherId: item.teacherId,
            updatedAt: new Date().toLocaleString(),
          });
          timetableModelObject
            .save()
            .then((callbackData) => {
              // Done
            })
            .catch((error) => {
              sendBack.push({ slot: parseInt(i) + 1, message: error });
            });
        } else {
          sendBack.push({
            slot: parseInt(i) + 1,
            message: "Slot is already reserved!",
          });
        }
      }
    );
  });
  if (sendBack.length > 0) {
    responce.json(sendBack);
  } else {
    responce.json({});
  }
});

router.get("/view", (request, responce) => {
  timetableModel.find((error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/lab", (request, responce) => {
  let labs = request.body;
  timetableModel.find({}, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      if (data) {
        labs.map((one, i) => {
          let status = false;
          data.map((two, j) => {
            if (one._id === two.labId.toString()) {
              status = true;
            }
          });
          labs[i].status = status;
        });
        responce.json(labs);
      }
    }
  });
});

router.get("/view/:id", (request, responce) => {
  timetableModel.findById(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/delete/:id", (request, responce) => {
  timetableModel.findByIdAndDelete(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/update/:id", (request, responce) => {
  timetableModel.findById(request.params.id, (error, userData) => {
    if (error) {
      console.log(error);
    } else {
      let toUpdate = {};
      if (request.body.labId !== userData.labId) {
        toUpdate.labId = request.body.labId;
      }
      if (request.body.day !== userData.day) {
        toUpdate.day = request.body.day;
      }
      if (request.body.startTime !== userData.startTime) {
        toUpdate.startTime = request.body.startTime;
      }
      if (request.body.endTime !== userData.endTime) {
        toUpdate.endTime = request.body.endTime;
      }
      if (request.body.subjectName !== userData.subjectName) {
        toUpdate.subjectName = request.body.subjectName;
      }
      if (request.body.teacherId !== userData.teacherId) {
        toUpdate.teacherId = request.body.teacherId;
      }
      if (request.body.updatedAt !== userData.updatedAt) {
        toUpdate.updatedAt = request.body.updatedAt;
      }
      timetableModel.findByIdAndUpdate(
        request.params.id,
        {
          ...toUpdate,
        },
        { new: true },
        (error, data) => {
          if (error) {
            console.log(error);
          } else {
            responce.json(data);
          }
        }
      );
    }
  });
});

module.exports = router;
