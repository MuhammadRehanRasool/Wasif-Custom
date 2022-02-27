import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CONSTANT,
  checkLoginFromStaff,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ComputerIcon from "@mui/icons-material/Computer";
import SubjectIcon from "@mui/icons-material/Subject";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TodayIcon from "@mui/icons-material/Today";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UserData from "../components/UserData";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function ViewTimetable() {
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    checkLoginFromStaff() ? navigate("/dashboard") : null;
  }, []);
  useEffect(() => {
    if (data.personal._id !== "") {
      fetchLab();
    }
  }, [data]);

  const [labs, setLabs] = useState([]);

  const fetchLab = async () => {
    await axios
      .get(CONSTANT.server + `labs/view/staffId/${data.personal._id}`)
      .then((responce) => {
        if (responce.status === 200) {
          axios
            .post(CONSTANT.server + `timetable/lab`, responce.data)
            .then((responce2) => {
              if (responce2.status === 200) {
                if (responce2.data) {
                  setLabs([...responce2.data]);
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const __init = {
    labId: "",
    slots: [
      {
        day: "",
        startTime: "",
        endTime: "",
        subjectName: "",
        teacherId: "",
      },
    ],
  };

  const [send, setSend] = useState(__init);

  const fetchTimetable = async (labId) => {
    await axios
      .get(CONSTANT.server + `timetable/lab/${labId}`)
      .then((responce) => {
        if (responce.status === 200) {
          setSend(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (send.labId !== "") {
      fetchTimetable(send.labId);
    }
  }, [send]);

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form row">
        <h1 className="mb-5 text-center">View Timetable</h1>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <ComputerIcon />
          </span>
          <select
            class="form-select form-control"
            name="labId"
            onChange={(e) => {
              changeSend(e);
            }}
            value={send.labId}
            aria-label="Select Lab"
          >
            <option
              value=""
              disabled
              selected={send.labId === "" ? true : false}
            >
              Select Lab
            </option>
            {labs.length > 0
              ? labs.map((one, i) => {
                  return (
                    <option
                      key={one._id}
                      value={one._id}
                      selected={send.labId === one._id ? true : false}
                      disabled={!one.status}
                    >
                      {one.name}
                    </option>
                  );
                })
              : ""}
          </select>
        </div>
      </div>
    </div>
  );
}
