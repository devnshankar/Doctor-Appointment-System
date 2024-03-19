import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import axios from "axios";
import dayjs from "dayjs"
import { Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/user-appointments`,
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

  const getRowKey = (record) => record.index;
  const columns = [
    {
      key: 0,
      title: "ID",
      dataIndex: "_id",
    },
    // {
    //   key: 1,
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorId.firstName} {record.doctorInfo.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   key: 2,
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    // },
    {
      key: 3,
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
      key: 4,
      title: "Status",
      dataIndex: "status",
    },
  ];
  return (
    <Layout>
      <div style={{ height: "832px" }}>
        <h1 style={{ textAlign: "center" }}>Appointments list</h1>
        <Table className="m-3 bg-dark-subtle"  columns={columns} dataSource={appointments} rowKey={getRowKey}/>
      </div>
    </Layout>
  );
};

export default Appointments;
