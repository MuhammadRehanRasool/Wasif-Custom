const express = require("express");
const router = express.Router();
const labsModel = require("../models/labsModel");
const dailyEquipmentReportModel = require("../models/dailyEquipmentReportModel");

router.post("/insert", (request, responce) => {
  dailyEquipmentReportModel.findOne(
    {
      date: request.body.date,
      staffId: request.body.staffId,
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
  dailyEquipmentReportModel.find().exec((error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.get("/view/software", (request, responce) => {
  dailyEquipmentReportModel
    .find({ problemWithSoftware: { $gt: 0 } })
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((a, b) => {
            return {
              staffId: a.staffId,
              problem: a.problemWithSoftware,
            };
          })
        );
      }
    });
});

router.get("/view/hardware", (request, responce) => {
  dailyEquipmentReportModel
    .find({ problemWithHardware: { $gt: 0 } })
    .populate({
      path: "staffId",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((a, b) => {
            return {
              staffId: a.staffId,
              problem: a.problemWithHardware,
            };
          })
        );
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
