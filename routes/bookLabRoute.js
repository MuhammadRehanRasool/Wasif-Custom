const express = require("express");
const router = express.Router();
const labsModel = require("../models/labsModel");
const bookLabModel = require("../models/bookLabModel");

router.post("/insert", (request, responce) => {
  let bookLabModelObject = new bookLabModel({
    ...request.body
  });
  bookLabModelObject
    .save()
    .then((callbackData) => {
      responce.json(callbackData);
    })
    .catch((error) => {
      responce.json(error);
    });
});

router.get("/view", (request, responce) => {
  bookLabModel
    .find({ confirmation: { $eq: [] } }, null, {
      sort: { createdAt: -1 },
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data
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
      confirmation: request.body.confirmation,
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
