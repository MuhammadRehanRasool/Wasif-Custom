import React, { useState, useEffect } from "react";
import "./../css/Committee.css";
import { Link } from "react-router-dom";
import { createSearchParams, useSearchParams } from "react-router-dom";

function FeedbackPage(props) {
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
                <div style={{width:"15rem"}} className="mt-5 custom-button text-center">
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
