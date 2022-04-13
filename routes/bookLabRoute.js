const express = require("express");
const router = express.Router();
const labsModel = require("../models/labsModel");
const bookLabModel = require("../models/bookLabModel");

router.post("/insert", (request, responce) => {
  bookLabModel.findOne(
    {
      labId: request.body.labId,
      date: request.body.date,
      startTime: request.body.startTime,
      endTime: request.body.endTime,
      confirmation: true,
    },
    (error, data) => {
      if (error) {
        console.log(error);
      }
      if (!data) {
        let bookLabModelObject = new bookLabModel({
          staffId: request.body.staffId,
          labId: request.body.labId,
          date: request.body.date,
          startTime: request.body.startTime,
          endTime: request.body.endTime,
        });
        bookLabModelObject
          .save()
          .then((callbackData) => {
            responce.json(callbackData);
          })
          .catch((error) => {
            responce.json(error);
          });
      } else {
        responce.json({ message: "Slot Booking Exists!" });
      }
    }
  );
});

router.get("/view", (request, responce) => {
  bookLabModel
    .find({ confirmation: false }, null, {
      sort: { createdAt: -1 },
    })
    .populate({
      path: "labId",
    })
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one) => {
            return {
              name: one.labId.name,
              date: one.date,
              slot: getRange([one.startTime, one.endTime]),
              createdAt: one.createdAt,
              username: one.staffId.username,
              email: one.staffId.email,
              identity: one.staffId.identity,
              _id: one._id,
            };
          })
        );
      }
    });
});

router.get("/view/all", (request, responce) => {
  bookLabModel
    .find({}, null, {
      sort: { createdAt: -1 },
    })
    .populate({
      path: "labId",
    })
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one) => {
            return {
              name: one.labId.name,
              date: one.date,
              slot: getRange([one.startTime, one.endTime]),
              createdAt: one.createdAt,
              username: one.staffId.username,
              email: one.staffId.email,
              identity: one.staffId.identity,
              _id: one._id,
              confirmation: one.confirmation,
            };
          })
        );
      }
    });
});

router.put("/confirm/:id", (request, responce) => {
  bookLabModel.findByIdAndUpdate(
    request.params.id,
    {
      confirmation: true,
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
});

function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}
const getRange = (tt) => {
  tt.map((two, j) => {
    if (parseInt(tt[j].slice(0, 2)) <= 12) {
      tt[j] += "AM";
    } else {
      tt[j] =
        pad(parseInt(parseInt(tt[j].slice(0, 2)) - 12)) + tt[j].slice(2) + "PM";
    }
  });
  return tt[0] + "-" + tt[1];
};

router.get("/view/me/:id", (request, responce) => {
  bookLabModel
    .find({ staffId: request.params.id }, null, {
      sort: { createdAt: -1 },
    })
    .populate({
      path: "labId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one) => {
            return {
              name: one.labId.name,
              date: one.date,
              slot: getRange([one.startTime, one.endTime]),
              createdAt: one.createdAt,
              confirmation: one.confirmation,
            };
          })
        );
      }
    });
});

router.get("/view/:id", (request, responce) => {
  bookLabModel.findById(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/delete/:id", (request, responce) => {
  bookLabModel.findByIdAndDelete(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

module.exports = router;
