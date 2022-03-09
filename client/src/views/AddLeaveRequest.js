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
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function AddLeaveRequest() {
  const { data, setData } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);

  const __init = {
    staffId: "",
    content: "",
    from: "",
    to: "",
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
    if (send.content !== "" && send.from !== "" && send.to !== "") {
      await axios
        .post(CONSTANT.server + "leaveRequest/insert", {
          ...send,
          staffId: data.personal._id,
        })
        .then((responce) => {
          if (responce.status === 200) {
            let res = responce.data;
            if (res.message) {
              setMessage(res.message, "danger");
            } else {
              setMessage(
                "Application Sent to Committee Successfully!",
                "success"
              );
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
        <h1 className="mb-5 text-center">Add Leave Request</h1>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <NotesIcon />
          </span>
          <textarea
            type="text"
            className="form-control"
            rows={10}
            placeholder="Write here..."
            name="content"
            onChange={changeData}
            value={send.content}
          ></textarea>
        </div>

        <div className="col-12">
          <label
            className={`text-${
              send.to ? (send.from > send.to ? "danger" : "dark") : "dark"
            }`}
          >
            {send.to
              ? send.from > send.to
                ? "Can't be greater than 'to' date."
                : "From"
              : "From"}
          </label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="date"
              className="form-control"
              placeholder="From"
              name="from"
              onChange={changeData}
              value={send.from}
            />
          </div>
        </div>
        <div className="col-12">
          <label
            className={`text-${
              send.to ? (send.to < send.from ? "danger" : "dark") : "dark"
            }`}
          >
            {send.to
              ? send.to < send.from
                ? "Can't be less than 'from' date."
                : "To"
              : "To"}
          </label>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <HourglassEmptyIcon />
            </span>
            <input
              type="date"
              className="form-control"
              placeholder="To"
              name="to"
              onChange={changeData}
              value={send.to}
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
            onClick={addData}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
