import React from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card m-2"
        style={{ width: "300px", cursor:"pointer",background:"lightgray",boxShadow:"2px 2px 10px rgba(0, 0, 0, 0.5)"}}
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div className="card-header" style={{background:"gray", fontSize:"16px", fontWeight:"bold", color:"black" }}>
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body p-2">
          <p className="m-0">
            <b>Specialization :</b> {doctor.specialization}
          </p>
          <p className="m-0">
            <b>Experience :</b> {doctor.experience}
          </p>
          <div className="card-body">
            <b>Contact Details</b>
            <p className="m-0">
              <b>Phone :</b> {doctor.phone}
            </p>
            <p className="m-0">
              <b>Email :</b> {doctor.email}
            </p>
            <p className="m-0">
              <b>Website :</b> {doctor.website}
            </p>
            <p className="m-0">
              <b>Address :</b> {doctor.address}
            </p>
          </div>
          <p className="m-0">
            <b>Timing :</b> {doctor.timings[0]} to {doctor.timings[1]}
          </p>
          <p className="m-0">
            <b>Fees :</b> {doctor.feesPerConsultation}
          </p>
        </div>
      </div>
    </>
  );
};

DoctorList.propTypes = {
  doctor: PropTypes.object,
};
export default DoctorList;
