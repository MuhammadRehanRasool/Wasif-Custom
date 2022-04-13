const express = require("express");
const router = express.Router();
const labsModel = require("../models/labsModel");
const leaveRequestModel = require("../models/leaveRequestModel");

router.post("/insert", (request, responce) => {
  let leaveRequestModelObject = new leaveRequestModel({
    staffId: request.body.staffId,
    content: request.body.content,
    from: request.body.from,
    to: request.body.to,
  });
  leaveRequestModelObject
    .save()
    .then((callbackData) => {
      responce.json(callbackData);
    })
    .catch((error) => {
      responce.json(error);
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
