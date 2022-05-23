import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CONSTANT, Loader } from "./../CONSTANT";
import { createSearchParams, useSearchParams } from "react-router-dom";
const axios = require("axios");

function FeedbackPage(props) {
    let navigate = useNavigate();

    const fetchTodayDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + "/" + dd + "/" + yyyy;
        return today;
    };

    const [message, setMessage] = useState({
        data: "Wrong QR",
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
                    navigate("/");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [data, setData] = useState({
          personal: {
            username: "",
            email: "",
            phone: "",
            role: "",
            identity: "",
            createdAt: "",
            _id: "",
          },
          isLoggedIn: false
      });

      useEffect(() => {
        if(localStorage.getItem("loggedin")){
            setData({
                personal:{
                    ...JSON.parse(localStorage.getItem("loggedin")).data
                },
                isloggedIn: true
            })
        }
      },[])

    useEffect(() => {
        if (data.personal._id !== "") {
            if (message.date !== "" && message.id !== "" && message.status !== "" && message.url !== "") {
                console.log("READY TO FLY", );

                window.location.href = (`${CONSTANT.server}staffAttendance/qrcode/${message.date}/${message.id}/${message.status}/${message.url}`);
            }
            else if (searchParams.get("type") && searchParams.get("id") && message.status === "" && message.type === "" && message.id === "") {
                console.log("TYPE and ID get");
                if (searchParams.get("id") === data.personal._id.toString()) {
                    console.log("TYPE and ID get - SAME USER");
                    checkAttendance(searchParams.get("id"), searchParams.get("type"));
                }
                else {
                    console.log("TYPE and ID get - NOT SAME USER", searchParams.get("id"), data.personal._id.toString());
                    navigate("/")
                }
            }
            else if (searchParams.get("message") && message.data === "Wrong QR") {
                console.log("MESSAGE SET");
                setMessage({
                    ...message,
                    data: searchParams.get("message")
                })
            }
        }
    }, [searchParams, message, data])
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
