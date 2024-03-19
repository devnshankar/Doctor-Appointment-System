import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/doctor/doctor-appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Authorization: "Bearer"+" "+ localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/doctor/update-status`,
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Authorization: "Bearer"+" "+ localStorage.getItem("token"),
          },
        }
      );
      if(res.data.success){
        message.success(res.data.message)
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong while updating appointment status");
    }
  };

  const getRowKey = (record) => record.index;
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Date & time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {dayjs(record.date).format("DD-MM-YYYY")} &nbsp;
          {dayjs(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <div className="d-flex" style={{ gap: "10px" }}>
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleStatus(record, "regected")}
              >
                Regect
              </button>
            </div>
          ) : (
            <div className="d-flex" style={{ gap: "10px" }}>
              <button
                className="btn"
                disabled
                style={{ background: "gray", color: "white" }}
              >
                Approve
              </button>
              <button
                className="btn"
                disabled
                style={{ background: "gray", color: "white" }}
              >
                Regect
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ height: "832px" }}>
        <h1 style={{ textAlign: "center" }}>Appointments list</h1>
        <Table columns={columns} dataSource={appointments} rowKey={getRowKey} />
      </div>
    </Layout>
  );
};

export default DoctorAppointments;
