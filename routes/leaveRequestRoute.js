const express = require("express");
const router = express.Router();
const labsModel = require("../models/labsModel");
const leaveRequestModel = require("../models/leaveRequestModel");
const multer = require("multer");
const path = require("path");



const fetchTodayDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  return today;
};


const formatDate = (date) => {
  var today = new Date(date);
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  return today;
};

function fetchPreviousMonthDate() {
  let date = new Date(fetchTodayDate())
  date.setMonth(date.getMonth() - 1)
  return formatDate(date)
}

const storage = multer.diskStorage({
  destination: "./client/public/proofs/",
  filename: function (req, file, cb) {
    cb(null, "proof-" + req.body.staffId + req.body.from + req.body.to + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myfile");

router.post("/insert", (request, responce) => {

  upload(request, responce, () => {
    const today = new Date();
    let payload = {
      ...request.body,
      date: fetchTodayDate()
    }
    if (request.file) {
      payload.attachment = request.file.filename
    }
    else {
      payload.attachment = ""
    }
    if (payload.type === "casual") {
      leaveRequestModel
        .count({
          staffId: payload.staffId,
          type: "casual",
          date: {
            $gt: fetchPreviousMonthDate(),
            $lte: fetchTodayDate()
          },
        })
        .exec((error, count) => {
          if (error) {
            console.log(error);
          } else {
            if (count >= 2) {
              responce.json({ "message": "You have already gained 2 leaves casually!" });
            }
          }
        });
    }
    let leaveRequestModelObject = new leaveRequestModel(payload);
    leaveRequestModelObject
      .save()
      .then((callbackData) => {
        responce.json(callbackData);
      })
      .catch((error) => {
        responce.json(error);
      });
  });
});

router.get("/view/checkCasual/:staffId", (request, responce) => {
  leaveRequestModel
    .count({
      staffId: request.params.staffId,
      type: "casual",
      date: {
        $gt: fetchPreviousMonthDate(),
        $lte: fetchTodayDate()
      },
    })
    .exec((error, count) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(count);
      }
    });
});

router.get("/view", (request, responce) => {
  leaveRequestModel
    .find()
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(data);
      }
    });
});

router.get("/view/me/:id", (request, responce) => {
  leaveRequestModel
    .find({ staffId: request.params.id }, null, {
      sort: { createdAt: -1 },
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one, i) => {
            return {
              from: one.from,
              to: one.to,
              content: one.content,
              createdAt: one.createdAt,
              confirmation1: one.confirmation1,
              confirmation2: one.confirmation2,
              attachment: one.attachment,
            };
          })
        );
      }
    });
});

router.get("/view/committee", (request, responce) => {
  leaveRequestModel
    .find({ confirmation1: false }, null, {
      sort: { createdAt: -1 },
    })
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one, i) => {
            return {
              name: one.staffId.username,
              email: one.staffId.email,
              id: one.staffId.identity,
              from: one.from,
              to: one.to,
              content: one.content,
              createdAt: one.createdAt,
              staffId: one.staffId._id,
              attachment: one.attachment,
              _id: one._id,
            };
          })
        );
      }
    });
});

router.get("/view/hod", (request, responce) => {
  leaveRequestModel
    .find({ confirmation1: true, confirmation2: false }, null, {
      sort: { createdAt: -1 },
    })
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one, i) => {
            return {
              name: one.staffId.username,
              email: one.staffId.email,
              id: one.staffId.identity,
              from: one.from,
              to: one.to,
              content: one.content,
              createdAt: one.createdAt,
              staffId: one.staffId._id,
              attachment: one.attachment,
              _id: one._id,
            };
          })
        );
      }
    });
});

router.put("/committee/confirm/:id", (request, responce) => {
  leaveRequestModel.findByIdAndUpdate(
    request.params.id,
    {
      confirmation1: true,
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

router.put("/hod/confirm/:id", (request, responce) => {
  leaveRequestModel.findByIdAndUpdate(
    request.params.id,
    {
      confirmation2: true,
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

router.get("/view/:id", (request, responce) => {
  leaveRequestModel.findById(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/delete/:id", (request, responce) => {
  leaveRequestModel.findByIdAndDelete(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/update/:id", (request, responce) => {
  leaveRequestModel.findById(request.params.id, (error, userData) => {
    if (error) {
      console.log(error);
    } else {
      let toUpdate = {};
      if (request.body.staffId !== userData.staffId) {
        toUpdate.staffId = request.body.staffId;
      }
      if (request.body.content !== userData.content) {
        toUpdate.content = request.body.content;
      }
      if (request.body.confirmation1 !== userData.confirmation1) {
        toUpdate.confirmation1 = request.body.confirmation1;
      }
      if (request.body.confirmation2 !== userData.confirmation2) {
        toUpdate.confirmation2 = request.body.confirmation2;
      }
      leaveRequestModel.findByIdAndUpdate(
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
