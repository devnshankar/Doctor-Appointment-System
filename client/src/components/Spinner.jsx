import React from "react";
import {DotLoader} from 'react-spinners'
import "../styles/SpinnerStyles.css"

const Spinner = () => {
  return (
    <div
      className="spinner-container d-flex justify-content-center spinner"
      style={{ backgroundColor: "#002132" }}
    >
      {/* <DotLoader size={80} className="spinner" speedMultiplier={1.5} color="#0084ca" /> */}
      <img style={{width: '80px'}} src="../public/logo.png"></img>
    </div>
  );
};

export default Spinner;
