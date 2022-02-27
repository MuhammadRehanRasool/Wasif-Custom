const express = require("express");
const router = express.Router();
const labsModel = require("../models/labsModel");

router.post("/insert", (request, responce) => {
  labsModel.findOne({ name: request.body.name }, (error, data) => {
    if (error) {
      console.log(error);
    }
    if (!data) {
      let labsModelObject = new labsModel({
        name: request.body.name,
        controller: request.body.controller,
      });
      labsModelObject
        .save()
        .then((callbackData) => {
          responce.json(callbackData);
        })
        .catch((error) => {
          responce.json(error);
        });
    } else {
      responce.json({ message: "Lab with same name already exists!" });
    }
  });
});

router.get("/view", (request, responce) => {
  labsModel
    .find({})
    .populate({
      path: "controller",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data.map((one) => {
            return {
              name: one.name,
              controller: {
                username: one.controller.username,
                identity: one.controller.identity,
                email: one.controller.email,
                _id: one.controller._id,
              },
              _id: one._id,
            };
          })
        );
      }
    });
});

router.get("/view/staffId/:staffId", (request, responce) => {
  labsModel
    .find({})
    .populate({
      path: "controller",
    })
    .exec((error, data) => {
      if (error) {
        console.log(error);
      } else {
        responce.json(
          data
            .filter((one) => {
              return one.controller._id.toString() === request.params.staffId;
            })
            .map((one) => {
              return {
                name: one.name,
                controller: {
                  username: one.controller.username,
                  identity: one.controller.identity,
                  email: one.controller.email,
                  _id: one.controller._id,
                },
                _id: one._id,
              };
            })
        );
      }
    });
});

router.get("/view/:id", (request, responce) => {
  labsModel.findById(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/delete/:id", (request, responce) => {
  labsModel.findByIdAndDelete(request.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      responce.json(data);
    }
  });
});

router.post("/update/:id", (request, responce) => {
  labsModel.findById(request.params.id, (error, userData) => {
    if (error) {
      console.log(error);
    } else {
      let toUpdate = {};
      if (request.body.name !== userData.name) {
        toUpdate.name = request.body.name;
      }
      if (request.body.controller !== userData.controller) {
        toUpdate.controller = request.body.controller;
      }
      labsModel.findByIdAndUpdate(
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