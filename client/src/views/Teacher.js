import React, { useState, useEffect } from "react";
import "./../css/Staff.css";
import UserData from "../components/UserData";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { CONSTANT, Loader } from "./../CONSTANT";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import { QRCodeCanvas } from "qrcode.react";
const axios = require("axios");

function Teacher(props) {
  const { data, setData } = React.useContext(UserData);
  // User Data

  // const fetchTodayDate = () => {
  //   var today = new Date();
  //   var dd = String(today.getDate()).padStart(2, "0");
  //   var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  //   var yyyy = today.getFullYear();
  //   today = mm + "/" + dd + "/" + yyyy;
  //   return today;
  // };

  // const [isMarked, setIsMarked] = useState([]);
  // const [send, setSend] = useState({
  //   date: fetchTodayDate(),
  //   staffId: data.personal._id,
  //   status: "",
  //   url:window.location.origin.replace(/(^\w+:|^)\/\//, '')
  // });
  // const checkAttendance = async () => {
  //   await axios
  //     .post(CONSTANT.server + "staffAttendance/check", {
  //       staffId: data.personal._id,
  //       date: fetchTodayDate(),
  //     })
  //     .then((responce) => {
  //       if (responce.status === 200) {
  //         let op = responce.data;
  //         setIsMarked(op);
  //         if (op.length !== 2) {
  //           let status = "in";
  //           if (op.includes("in") && op.length === 1) {
  //             status = "out";
  //           }
  //           setSend({
  //             ...send,
  //             status: status
  //           })
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // useEffect(() => {
  //   if (data.personal._id !== "") {
  //     checkAttendance();
  //   }
  // }, [data]);
  return (
    <div className="__Staff">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 mt-2 text-center">Welcome {data.personal.username}!</h1>
        {/* <h3 className="mb-4 mt-2 text-center">{isMarked.length === 2 ? "Attendance Already Marked" : `Mark Attendance (check ${send.status})`}</h3>
        {
          isMarked.length !== 2 ? <div className="mt-5 qrcode d-flex flex-column justify-content-center align-items-center">
            <QRCodeCanvas value={`${CONSTANT.server}staffAttendance/qrcode/${send.date}/${send.staffId}/${send.status}/${send.url}`} className="qrcode-image" size={256} />
            <p className="mt-4">Scan QRCode from your device to check {send.status}!</p>
            <p className="mt-5 text-muted">OR</p>
          </div> : ""
        }
        <div className="w-100 mt-5 custom-button text-center">
          <Link to="/staffAttendance">
            <button
              type="button"
              className="btn btn-primary"
              style={{
                padding: "12px 15px",
              }}
            >
              {isMarked.length === 2 ? "Check Attendance" : "Mark Attendance Manually"}
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default Teacher;
