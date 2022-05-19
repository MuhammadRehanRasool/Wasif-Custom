import React, { useState, useEffect } from "react";
import "./../css/Staff.css";
import UserData from "../components/UserData";
import { Link } from "react-router-dom";
import { CONSTANT, Loader } from "./../CONSTANT";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { QrReader } from 'react-qr-reader';
const axios = require("axios");

function Staff(props) {
  let navigate = useNavigate();
  const { data, setData } = React.useContext(UserData);
  // User Data

  const [scanOpen, setScanOpen] = useState(false);
  const handleErrorWebCam = (error) => {
    console.log(error);
  }
  const handleScanWebCam = (result) => {
    console.log(result)
    if (result) {
      console.log(result)
    }
  }

  return (
    <div className="__Staff">
      <div className="row d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 mt-2 text-center">Welcome {data.personal.username}!</h1>
        <h3 className="mb-4 mt-2 text-center">Scan QR Code</h3>
        <div className="w-50 mt-3 custom-button text-center">
          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: "12px 15px",
            }}
            onClick={() => {
              setScanOpen((scanOpen) => {
                return !scanOpen
              })
            }}
          >
            {scanOpen ? "Close" : "Open"} Scanner
          </button>
          {scanOpen ? <QrReader
            delay={300}
            style={{ width: '100%' }}
            onError={handleErrorWebCam}
            onScan={handleScanWebCam}
            className="scanner"
          /> : ""}
        </div>
      </div>
    </div>
  );
}

export default Staff;
