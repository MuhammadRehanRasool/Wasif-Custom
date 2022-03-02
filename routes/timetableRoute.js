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

function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}

const fetchRanges = (slots) => {
  let temp = slots;
  let days = [];
  let defaultValue = temp[0].day;
  days.push(defaultValue);
  temp.map((one, i) => {
    if (one.day !== defaultValue) {
      defaultValue = one.day;
      days.push(one.day);
    }
  });
  let time = [];
  temp.map((one, i) => {
    time = [...time, one.startTime + "-" + one.endTime];
  });
  time = [...new Set(time)]
    .sort(function (a, b) {
      return a.split("-")[0].localeCompare(b.split("-")[0]);
    })
    .map((one, i) => {
      let tt = one.split("-");
      tt.map((two, j) => {
        if (parseInt(tt[j].slice(0, 2)) <= 12) {
          tt[j] += "AM";
        } else {
          tt[j] =
            pad(parseInt(parseInt(tt[j].slice(0, 2)) - 12)) +
            tt[j].slice(2) +
            "PM";
        }
      });
      return tt[0] + "-" + tt[1];
    });
  return [days, time];
};

const formatSlots = (slots) => {
  let temp = slots;
  const sorter = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };
  temp = temp.sort(function sortByDay(a, b) {
    let day1 = a.day.toLowerCase();
    let day2 = b.day.toLowerCase();
    return sorter[day1] - sorter[day2];
  });
  let temp2 = [];
  let defaultDay = temp[0].day;
  temp2.push([]);
  temp.map((one, i) => {
    if (one.day !== defaultDay) {
      defaultDay = one.day;
      temp2.push([]);
      temp2[temp2.length - 1].push(one);
    } else {
      temp2[temp2.length - 1].push(one);
    }
  });
  temp = [];
  temp2.map((one, i) => {
    temp = [
      ...temp,
      ...one.sort(function (a, b) {
        return a.startTime.localeCompare(b.startTime);
      }),
    ];
  });
  return temp;
};

router.get("/lab/:labId", (request, responce) => {
  timetableModel
    .find({ labId: request.params.labId })
    .populate({
      path: "teacherId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        if (data) {
          let slots = [];
          data.map((one, i) => {
            slots.push({
              day: one.day,
              startTime: one.startTime,
              endTime: one.endTime,
              subjectName: one.subjectName,
              teacherId: {
                username: one.teacherId.username,
                email: one.teacherId.email,
              },
              _id: one._id,
              updatedAt: one.updatedAt,
            });
          });
          responce.json({
            slots: formatSlots(slots),
            addOn: fetchRanges(slots),
          });
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

// {
//   "labId": "6217da697a0f89aff0a62206",
//   "slots": [
//       {
//           "day": "monday",
//           "startTime": "11:30",
//           "endTime": "13:00",
//           "subjectName": "DE",
//           "teacherId": "621b58f54607b18a0e6f43ce"
//       },
//       {
//           "day": "monday",
//           "startTime": "13:00",
//           "endTime": "14:30",
//           "subjectName": "AI",
//           "teacherId": "621b59034607b18a0e6f43d1"
//       },
//       {
//           "day": "tuesday",
//           "startTime": "11:30",
//           "endTime": "13:00",
//           "subjectName": "HCI",
//           "teacherId": "621b58f54607b18a0e6f43ce"
//       },
//       {
//           "day": "thursday",
//           "startTime": "11:30",
//           "endTime": "13:00",
//           "subjectName": "HCI",
//           "teacherId": "621b58f54607b18a0e6f43ce"
//       },
//       {
//           "day": "wednesday",
//           "startTime": "11:30",
//           "endTime": "13:00",
//           "subjectName": "DE",
//           "teacherId": "621b58f54607b18a0e6f43ce"
//       },
//       {
//           "day": "wednesday",
//           "startTime": "13:00",
//           "endTime": "14:30",
//           "subjectName": "AI",
//           "teacherId": "621b59034607b18a0e6f43d1"
//       },
//       {
//           "day": "thursday",
//           "startTime": "08:30",
//           "endTime": "11:30",
//           "subjectName": "AI Lab",
//           "teacherId": "621b59034607b18a0e6f43d1"
//       },
//       {
//           "day": "friday",
//           "startTime": "08:30",
//           "endTime": "11:30",
//           "subjectName": "DS",
//           "teacherId": "621b59034607b18a0e6f43d1"
//       },
//       {
//           "day": "saturday",
//           "startTime": "11:30",
//           "endTime": "15:00",
//           "subjectName": "PDC",
//           "teacherId": "621b59034607b18a0e6f43d1"
//       },
//       {
//           "day": "saturday",
//           "startTime": "15:00",
//           "endTime": "18:00",
//           "subjectName": "Dev Ops",
//           "teacherId": "621b59034607b18a0e6f43d1"
//       }
//   ]
// }
