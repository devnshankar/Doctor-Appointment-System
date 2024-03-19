import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker, message } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
const BookingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const params = useParams();
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isavailable, setIsavailable] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // login user data
  const getDoctorById = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/doctor/getDoctorById`,
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Authorization: "Bearer"+" "+ localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // booking handler
  const handleBooking = async () => {
    try {
      setIsavailable(true);
      if (!date && !time) {
        return alert("Date & time required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Authorization: "Bearer"+" "+ localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // availability handler
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/booking-availability`,
        {
          doctorId: params.doctorId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Authorization: "Bearer"+" "+ localStorage.getItem("token"),
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        setIsavailable(true);
        console.log(isavailable);
        message.success(res.data.message);
      } else {
        message.error(res.data.message); //!check it also
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorById();
    // handleAvailability();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <div style={{ height: "833px" }}>
        <h2 style={{ textAlign: "center", padding: "10px" }}>
          Book an appointment now !!!
        </h2>
        <div className="container m-2">
          {doctors && (
            <div>
              <h4>
                Dr. {doctors.firstName} {doctors.lastName}
              </h4>
              <h4>Fees : {doctors.feesPerConsultation}</h4>
              <h4>
                Timings : {doctors.timings && doctors.timings[0]} -{" "}
                {doctors.timings && doctors.timings[1]}{" "}
              </h4>
              <div className="d-flex flex-column w-50">
                <DatePicker
                  aria-required={"true"}
                  className="m-2"
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(value);
                  }}
                />
                <TimePicker
                  aria-required={"true"}
                  className="m-2"
                  format="HH:mm"
                  onChange={(value) => {
                    setTime(value);
                  }}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleAvailability}
                >
                  Check availability
                </button>
                {!isavailable && (
                  <button
                    className="btn btn-success mt-2"
                    onClick={handleBooking}
                  >
                    Book now
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
