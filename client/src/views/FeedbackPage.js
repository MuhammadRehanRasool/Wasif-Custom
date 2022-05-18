import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import { Link } from "react-router-dom";
import { CONSTANT, Loader } from "./../CONSTANT";
import { createSearchParams, useSearchParams } from "react-router-dom";
const axios = require("axios");

function FeedbackPage(props) {

    const fetchTodayDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + "/" + dd + "/" + yyyy;
        return today;
    };

    const [message, setMessage] = useState({
        data: "No Message",
        type: "",
        date: fetchTodayDate(),
        id: "",
        status: "",
        url: window.location.origin.replace(/(^\w+:|^)\/\//, ''),
    });
    const [searchParams, setSearchParams] = useSearchParams();

    const checkAttendance = async (id) => {
        await axios
            .post(CONSTANT.server + "staffAttendance/check", {
                staffId: id,
                date: fetchTodayDate(),
            })
            .then((responce) => {
                if (responce.status === 200) {
                    let op = responce.data;
                    if (op.length !== 2) {
                        let status = "in";
                        if (op.includes("in") && op.length === 1) {
                            status = "out";
                        }
                        setMessage({
                            ...message,
                            status: status,
                            type: searchParams.get("type"),
                            id: searchParams.get("id")
                        })
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (message.date !== "" && message.id !== "" && message.status !== "" && message.url !== "") {
            window.location.href = (`${CONSTANT.server}staffAttendance/qrcode/${message.date}/${message.id}/${message.status}/${message.url}`);
        }
        if (searchParams.get("type") && searchParams.get("id") && message.status === "" && message.type === "" && message.id === "") {
            checkAttendance(searchParams.get("id"),searchParams.get("type"));
        }
        if (searchParams.get("message") && message.data === "No Message") {
            setMessage({
                ...message,
                data: searchParams.get("message")
            })
        }
    }, [searchParams, message])
    return (
        <div className="__Committee">
            <div className="row d-flex flex-column justify-content-center align-items-center text-center mt-5">
                <h1>{message.data}</h1>
                <div style={{ width: "15rem" }} className="mt-5 custom-button text-center">
                    <Link to="/">
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{
                                padding: "12px 15px",
                            }}
                        >
                            Go Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FeedbackPage;
