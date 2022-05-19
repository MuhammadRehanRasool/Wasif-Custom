import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CoPresentIcon from "@mui/icons-material/CoPresent";

import {
    CONSTANT,
    checkLoginFromCommittee,
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

function ViewCategories(props) {
    const [search, setSearch] = useState("");
    // User Data
    let navigate = useNavigate();
    useEffect(() => {
        if (checkLoginFromCommittee()) {
            navigate("/dashboard");
        }
    }, []);

    const [dates, setDates] = useState([]);
    const fetchDates = async () => {
        await axios
            .get(CONSTANT.server + `categories/view`)
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
        fetchDates();
    }, []);

    return (
        <div className="__Committee">
            <div className="row d-flex flex-column justify-content-center align-items-center">
                <div className="row d-flex flex-row justify-content-center align-items-center">
                    <h1 className="mb-4 text-center">View Categories</h1>
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
                                    <th scope="col">Type</th>
                                    <th scope="col">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dates.length > 0
                                    ? dates
                                        .filter((date, i) => {
                                            return (
                                                date.type.includes(search) ||
                                                date.name.includes(search)
                                            );
                                        })
                                        .map((date, i) => {
                                            return (
                                                <tr>
                                                    <td>{date.type[0].toUpperCase()}{date.type.slice(1)}</td>
                                                    <td>{date.name[0].toUpperCase()}{date.name.slice(1)}</td>
                                                </tr>
                                            );
                                        })
                                    : "No Categories"}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewCategories;
