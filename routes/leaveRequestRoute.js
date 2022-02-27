const express = require("express");
const router = express.Router();
const leaveRequestModel = require("../models/leaveRequestModel");

router.post("/insert", (request, responce) => {
  let leaveRequestModelObject = new leaveRequestModel({
    staffId: request.body.staffId,
    content: request.body.content,
    confirmation1: request.body.confirmation1,
    confirmation2: request.body.confirmation2,
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
  leaveRequestModel.find((error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
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
