const express = require("express");
const router = express.Router();
const labsModel = require("../models/labsModel");
const dailyEquipmentReportModel = require("../models/dailyEquipmentReportModel");

router.post("/insert", (request, responce) => {
  dailyEquipmentReportModel.findOne(
    {
      date: request.body.date,
      slotId: request.body.slotId,
    },
    (error, data) => {
      if (error) {
        console.log(error);
      }
      if (!data) {
        let dailyEquipmentReportModelObject = new dailyEquipmentReportModel({
          staffId: request.body.staffId,
          problemDomain: request.body.problemDomain,
          problemWithHardware: request.body.problemWithHardware,
          problemWithSoftware: request.body.problemWithSoftware,
          problemWithNetworking: request.body.problemWithNetworking,
          problemWithOtherEquipment: request.body.problemWithOtherEquipment,
          description: request.body.description,
          date: request.body.date,
        });
        dailyEquipmentReportModelObject
          .save()
          .then((callbackData) => {
            responce.json(callbackData);
          })
          .catch((error) => {
            responce.json(error);
          });
      } else {
        responce.json({ message: "Report Already Submitted!" });
      }
    }
  );
});

router.get("/view", (request, responce) => {
  dailyEquipmentReportModel.find((error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.get("/view/me/:id", (request, responce) => {
  dailyEquipmentReportModel
    .find({ staffId: request.params.id }, null, {
      sort: { createdAt: -1 },
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(data);
      }
    });
});

router.get("/view/:id", (request, responce) => {
  dailyEquipmentReportModel.findById(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/delete/:id", (request, responce) => {
  dailyEquipmentReportModel.findByIdAndDelete(
    request.params.id,
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(data);
      }
    }
  );
});

module.exports = router;
