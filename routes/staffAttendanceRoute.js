const express = require("express");
const router = express.Router();
const staffAttendanceModel = require("../models/staffAttendanceModel");

router.post("/insert", (request, responce) => {
  staffAttendanceModel.findOne(
    { date: request.body.date, staffId: request.body.staffId },
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
        responce.json({ message: "Attendance Already Marked!" });
      }
    }
  );
});

router.get("/view", (request, responce) => {
  staffAttendanceModel.find({},null,
    { sort: { date: -1 } },(error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/check", (request, responce) => {
  staffAttendanceModel.findOne(
    { date: request.body.date, staffId: request.body.staffId },
    (error, data) => {
      if (error) {
        console.log(error);
      }
      if (!data) {
        responce.json(false);
      } else {
        responce.json(true);
      }
    }
  );
});

router.get("/view/:staffId", (request, responce) => {
  staffAttendanceModel.find(
    { staffId: request.params.staffId },null,
    { sort: { date: -1 } },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(data);
      }
    }
  );
});

router.post("/delete/:id", (request, responce) => {
  staffAttendanceModel.findByIdAndDelete(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

// router.get("/delete", (request, responce) => {
//   staffAttendanceModel.deleteMany({}, (error, data) => {
//     if (error) {
//       console.log(error);
//     } else {
//       responce.json(data);
//     }
//   });
// });

module.exports = router;
