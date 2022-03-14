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
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EmailIcon from "@mui/icons-material/Email";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import HardwareIcon from "@mui/icons-material/Hardware";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function DailyEquipmentReport() {
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
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
    problemDomain: {
      hardware: "",
      software: "",
      networking: "",
      otherEquipment: "",
    },
    problemWithHardware: "",
    problemWithSoftware: "",
    problemWithNetworking: "",
    problemWithOtherEquipment: "",
    description: "",
    date: fetchTodayDate(),
  };
  const [send, setSend] = useState(__init);
  const changeData = (e) => {
    if (e.target.name === "problemDomain") {
      setSend({
        ...send,
        problemDomain: {
          ...send.problemDomain,
          [e.target.getAttribute("data-name")]: e.target.value,
        },
      });
    } else {
      setSend({
        ...send,
        [e.target.name]: e.target.value,
      });
    }
  };

  const addData = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      send.problemDomain.hardware !== "" &&
      send.problemDomain.software !== "" &&
      send.problemDomain.networking !== "" &&
      send.problemDomain.otherEquipment !== "" &&
      send.problemWithHardware !== "" &&
      send.problemWithSoftware !== "" &&
      send.problemWithNetworking !== "" &&
      send.problemWithOtherEquipment !== "" &&
      send.description !== ""
    ) {
      await axios
        .post(CONSTANT.server + "dailyEquipmentReport/insert", {
          ...send,
          staffId: data.personal._id,
        })
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage("Report Submitted Successfully!", "success");
              setSend(__init);
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
  return (
    <div className="__AddUser row d-flex justify-content-center align-items-center">
      <div className="form col-lg-6 col-sm-12">
        <h1 className="mb-5 text-center">Daily Equipment Report</h1>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <CalendarTodayIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Date"
            name="date"
            disabled
            value={send.date}
          />
        </div>
        <br />

        <h5>Problem Domains</h5>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <HardwareIcon />
          </span>
          <select
            class="form-select form-control"
            name="problemDomain"
            data-name="hardware"
            onChange={changeData}
            value={send.problemDomain.hardware}
            aria-label="Hardware"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.hardware === "" ? true : false}
            >
              Hardware
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.hardware === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.hardware === "notWorking" ? true : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.hardware === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <AppShortcutIcon />
          </span>
          <select
            class="form-select form-control"
            name="problemDomain"
            data-name="software"
            onChange={changeData}
            value={send.problemDomain.software}
            aria-label="Software"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.software === "" ? true : false}
            >
              Software
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.software === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.software === "notWorking" ? true : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.software === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <CellTowerIcon />
          </span>
          <select
            class="form-select form-control"
            name="problemDomain"
            data-name="networking"
            onChange={changeData}
            value={send.problemDomain.networking}
            aria-label="Networking"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.networking === "" ? true : false}
            >
              Networking
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.networking === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.networking === "notWorking" ? true : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.networking === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <DevicesOtherIcon />
          </span>
          <select
            class="form-select form-control"
            name="problemDomain"
            data-name="otherEquipment"
            onChange={changeData}
            value={send.problemDomain.otherEquipment}
            aria-label="Other Equipment"
          >
            <option
              value=""
              disabled
              selected={send.problemDomain.otherEquipment === "" ? true : false}
            >
              Other Equipment
            </option>
            <option
              value="working"
              selected={
                send.problemDomain.otherEquipment === "working" ? true : false
              }
            >
              Working
            </option>
            <option
              value="notWorking"
              selected={
                send.problemDomain.otherEquipment === "notWorking"
                  ? true
                  : false
              }
            >
              Not Working
            </option>
            <option
              value="missing"
              selected={
                send.problemDomain.otherEquipment === "missing" ? true : false
              }
            >
              Missing
            </option>
          </select>
        </div>
        <br />
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <HardwareIcon />
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Problem With Hardware"
            name="problemWithHardware"
            onChange={changeData}
            value={data.problemWithHardware}
          />
        </div>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <AppShortcutIcon />
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Problem With Software"
            name="problemWithSoftware"
            onChange={changeData}
            value={data.problemWithSoftware}
          />
        </div>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <CellTowerIcon />
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Problem With Networking"
            name="problemWithNetworking"
            onChange={changeData}
            value={data.problemWithNetworking}
          />
        </div>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <DevicesOtherIcon />
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Problem With Other Equipment"
            name="problemWithOtherEquipment"
            onChange={changeData}
            value={data.problemWithOtherEquipment}
          />
        </div>

        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <NotesIcon />
          </span>
          <textarea
            type="text"
            className="form-control"
            rows={5}
            placeholder="Problem description..."
            name="description"
            onChange={changeData}
            value={send.description}
          ></textarea>
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
            onClick={addData}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
