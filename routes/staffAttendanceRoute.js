const express = require("express");
const router = express.Router();
const staffAttendanceModel = require("../models/staffAttendanceModel");
const labsModel = require("../models/labsModel");
const usersModel = require("../models/usersModel");

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
  staffAttendanceModel.find({}, null, { sort: { date: -1 } }, (error, data) => {
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
    { staffId: request.params.staffId },
    null,
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

router.get("/view/dated/:month/:day/:year", (request, responce) => {
  staffAttendanceModel.find(
    {
      date: `${request.params.month}/${request.params.day}/${request.params.year}`,
      status: "present",
    },
    null,
    { sort: { date: -1 } },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        presentStaff = data.map((a, i) => {
          return a.staffId;
        });
        responce.json(presentStaff);
      }
    }
  );
});

router.post("/view/dated", (request, responce) => {
  staffAttendanceModel
    .find(
      {
        date: { $gte: request.body.from },
        date: { $lte: request.body.till },
        staffId: request.body.staffId,
        status: "present",
      },
      null,
      { sort: { date: -1 } }
    )
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        let date1 = new Date(request.body.from);
        let date2 = new Date(request.body.till);
        let diffTime = Math.abs(date2 - date1);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        responce.json({
          total: diffDays,
          present: data.length,
          absent: diffDays - data.length,
          staff: data.map((a, b) => {
            return {
              _id: a.staffId._id,
              username: a.staffId.username,
              email: a.staffId.email,
              identity: a.staffId.identity,
              date: a.date,
            };
          }),
        });
      }
    });
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
