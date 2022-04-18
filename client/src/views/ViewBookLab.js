import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import UserData from "../components/UserData";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CoPresentIcon from "@mui/icons-material/CoPresent";

import {
  CONSTANT,
  checkLoginFromStaff,
  setMessage,
  resetMessage,
  isMessage,
} from "../CONSTANT";
const axios = require("axios");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function ViewBookLab(props) {
  const { data, setData } = React.useContext(UserData);
  const [search, setSearch] = useState("");
  // User Data
  let navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromStaff()) {
      navigate("/dashboard");
    }
  }, []);

  const [dates, setDates] = useState([]);
  const fetchDates = async () => {
    await axios
      .get(CONSTANT.server + `bookLab/view/me/${data.personal._id}`)
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          if (res.message) {
            setMessage(res.message, "danger");
          } else {
            setDates(res);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (data.personal._id !== "") {
      fetchDates();
    }
  }, [data]);

  return (
    <div className="__Committee">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <div className="row d-flex flex-row justify-content-center align-items-center">
          <h1 className="mb-4 text-center">View Lab Booking</h1>
          <div className="custom-input input-group mb-3">
            <span className="input-group-text">
              <PersonSearchIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              name="search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
            />
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Lab Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Slot</th>
                  <th scope="col">Created At</th>
                </tr>
              </thead>
              <tbody>
                {dates.length > 0
                  ? dates
                      .filter((date, i) => {
                        return (
                          date.name.includes(search) ||
                          date.date.includes(search) ||
                          date.slot.includes(search)
                        );
                      })
                      .map((date, i) => {
                        return (
                          <tr>
                            <td
                              className={`text-${
                                date.confirmation ? "success" : "danger"
                              }`}
                            >
                              {date.confirmation ? "" : "Not "}Confirmed
                            </td>
                            <td>{date.name}</td>
                            <td>{date.date}</td>
                            <td>{date.slot}</td>
                            <td>{new Date(date.createdAt).toLocaleString()}</td>
                          </tr>
                        );
                      })
                  : "No Report"}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBookLab;