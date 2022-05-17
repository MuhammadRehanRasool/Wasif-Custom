import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import UserData from "../components/UserData";
import { createSearchParams, useSearchParams } from "react-router-dom";
const axios = require("axios");

function FeedbackPage(props) {
    const { data, setData } = React.useContext(UserData);
    // User Data
    const [message, setMessage] = useState({
        data: "No Message",
    });
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get("message")) {
            setMessage({
                ...message,
                data: searchParams.get("message")
            })
        }
    }, [searchParams])
    return (
        <div className="__Committee">
            <div className="row d-flex flex-column justify-content-center align-items-center text-center mt-5">
                <h1>{message.data}</h1>
            </div>
        </div>
    );
}

export default FeedbackPage;
