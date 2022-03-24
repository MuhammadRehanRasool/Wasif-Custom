import React, { useState, useEffect } from "react";
import "./../css/Mixed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserData from "../components/UserData";

import {
  CONSTANT,
  checkLoginFromStaff,
  setMessage,
  resetMessage,
  isMessage,
} from "./../CONSTANT";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import NotesIcon from "@mui/icons-material/Notes";
import CellTowerIcon from "@mui/icons-material/CellTower";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EmailIcon from "@mui/icons-material/Email";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import HardwareIcon from "@mui/icons-material/Hardware";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ComputerIcon from "@mui/icons-material/Computer";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function BookLab() {
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
    fetchLab();
  }, []);

  const fetchTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    return mm + "/" + dd + "/" + yyyy;
  };
  const __init = {
    staffId: "",
    labId: "",
    date: "",
    startTime: "",
    endTime: "",
  };
  const [send, setSend] = useState(__init);
  const changeData = (e) => {
    setSend({
      ...send,
      [e.target.name]: e.target.value,
    });
  };

  const addData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      send.labId !== "" &&
      send.date !== "" &&
      send.startTime !== "" &&
      send.endTime !== ""
    ) {
      await axios
        .post(CONSTANT.server + "bookLab/insert", {
          ...send,
          staffId: data.personal._id,
        })
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage("Lab Booking Requested Successfully!", "success");
              setSend(__init);
              setSlots({
                actual: [],
                modified: [],
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMessage("Fill All Fields", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Add";
  };

  const [labs, setLabs] = useState([]);
  const [slots, setSlots] = useState({
    actual: [],
    modified: [],
  });

  const fetchLab = async (e) => {
    await axios
      .get(CONSTANT.server + `labs/view/lab/fetch`)
      .then((responce) => {
        if (responce.status === 200) {
          setLabs(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const labSlots = async (e) => {
    resetMessage();
    await axios
      .get(
        CONSTANT.server +
          `timetable/lab/book/${send.labId}/${
            days[new Date(e.target.value).getDay()]
          }`
      )
      .then((responce) => {
        if (responce.status === 200) {
          setSlots({
            actual: responce.data,
            modified: responce.data.map((one, i) => {
              let tt = one.split("-");
              tt.map((two, j) => {
                if (tt[j].slice(-2) === "AM") {
                  tt[j] = tt[j].slice(0, -2);
                } else {
                  tt[j] =
                    pad(parseInt(parseInt(tt[j].slice(0, 2)) + 12)) +
                    tt[j].slice(2, -2);
                }
              });
              return [tt[0], tt[1]];
            }),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }
  const checkClash = (e) => {
    let isAllow = true;
    for (let i = 0; i < slots.modified.length; i++) {
      if (
        send.startTime >= slots.modified[i][0] &&
        send.startTime <= slots.modified[i][1]
      ) {
        setMessage("Start time is in reserved slot!", "danger");
        isAllow = false;
        break;
      }
      if (
        send.endTime >= slots.modified[i][0] &&
        send.endTime <= slots.modified[i][1]
      ) {
        setMessage("End time is in reserved slot!", "danger");
        isAllow = false;
        break;
      }
      if (
        send.startTime < slots.modified[i][0] &&
        send.endTime > slots.modified[i][1]
      ) {
        setMessage(
          "There is already a slot between your slot range!",
          "danger"
        );
        isAllow = false;
        break;
      }
    }
    if (isAllow) {
      addData(e);
    }
  };

  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form col-lg-6 col-sm-12">
        <h1 className="mb-5 text-center">Book Lab</h1>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <ComputerIcon />
          </span>
          <select
            class="form-select form-control"
            name="labId"
            onChange={changeData}
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
                    >
                      {one.name}
                    </option>
                  );
                })
              : ""}
          </select>
        </div>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <CalendarTodayIcon />
          </span>
          <input
            type="date"
            className="form-control"
            placeholder="Date"
            name="date"
            value={send.date}
            onChange={(e) => {
              if (send.labId !== "") {
                changeData(e);
                labSlots(e);
              } else {
                setMessage("First select lab!", "danger");
              }
            }}
          />
        </div>

        <div className="col-12">
          <label>Start Time</label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="time"
              step={60 * 30}
              className="form-control"
              placeholder="Start Time"
              name="startTime"
              onChange={changeData}
              value={send.startTime}
            />
          </div>
        </div>

        <div className="col-12">
          <label>End Time</label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="time"
              step={60 * 30}
              className="form-control"
              placeholder="End Time"
              name="endTime"
              onChange={changeData}
              value={send.endTime}
            />
          </div>
        </div>

        <p
          className="text-danger p-0 m-0 mb-2"
          id="error"
          style={{ display: "none" }}
        >
          Error
        </p>
        <div className="w-100 mt-1 custom-button">
          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: "12px 15px",
            }}
            onClick={checkClash}
          >
            Add
          </button>
        </div>

        <div className="mt-5">
          <h5>Reserved Slots ({days[new Date(send.date).getDay()]})</h5>
          {slots.actual.length > 0
            ? slots.actual.map((one, i) => {
                return (
                  <p>
                    {i + 1}. {one}
                  </p>
                );
              })
            : "No Slots Reserved"}
        </div>
      </div>
    </div>
  );
}
