import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message } from "antd";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);


  // getDoctor from server
  const getDoctors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/getAllDoctors`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // handle account
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/changeAccountStatus`,
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        getDoctors();
        message.success(res.data.message);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
    
  };
  useEffect(() => {
    getDoctors();
  }, []);

  // antd user table col
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="actions-container" style={{ display: "flex" }}>
          {record.status === "pending" ? (
            <button
              className="btn btn-success"
              style={{ width: "100px" }}
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button className="btn btn-danger" style={{ width: "100px" }}>
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  const pagination = {
    pageSize: 9,
  };
  return (
    <Layout>
      <h1 className="m-2 text-center">Doctors List</h1>
      <Table
        pagination={pagination}
        columns={columns}
        dataSource={doctors}
        rowClassName="custom-row-style"
        rowKey="_id" //!THIS IS AN ERROR SOLVED BY ME NOTICE AND REMEMBER
        style={{
          margin: "5px",
          border: "1px solid",
          borderRadius: "5px",
          borderColor: "lightgray",
          height:"760px"
        }}
      />
    </Layout>
  );
};

export default Doctors;
