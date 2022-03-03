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
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NumbersIcon from "@mui/icons-material/Numbers";
export default function AddLeaveRequest() {
  const { dataP, setDataP } = React.useContext(UserData);
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);

  const __init = {
    staffId: "",
    subject: "",
    content: "",
  };
  const [data, setData] = useState(__init);
  const changeData = (e) => {
    setData({
      ...data,
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
        data.email !== "" &&
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
      ) {
        if (
          data.password !== "" &&
          data.username !== "" &&
          data.phone !== "" &&
          data.role !== "" &&
          data.identity !== ""
        ) {
          await axios
            .post(CONSTANT.server + "leaveRequest/insert", data)
            .then((responce) => {
              if (responce.status === 200) {
                let res = responce.data;
                if (res.message) {
                  setMessage(res.message, "danger");
                } else {
                  setMessage("User Added Successfully!", "success");
                  setData(__init);
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setMessage("Fill All Fields", "danger");
        }
      } else {
        setMessage("Please Enter Valid Email", "danger");
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
            <AlternateEmailIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Subject"
            name="subject"
            onChange={changeData}
            value={data.subject}
          />
        </div>
        <div className="custom-input input-group mb-3">
          <span className="input-group-text">
            <EmailIcon />
          </span>
          <textarea
            type="text"
            className="form-control"
            rows={10}
            placeholder="Content"
            name="content"
            onChange={changeData}
            value={data.content}
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
