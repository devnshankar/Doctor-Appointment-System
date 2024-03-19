import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table } from "antd";
const Users = () => {
  const [users, setUsers] = useState([]);

  // getUsers from server
  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // antd user table col
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      render: (text, record) => {
        const createdAtDate = record.createdAt?.slice(0, 10);
        return <span>{createdAtDate}</span>;
      },
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      render: (text, record) => {
        const createdAtTime = record.createdAt?.slice(12, 19);
        return <span>{createdAtTime}</span>;
      },
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "yes" : "No"}</span>,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      render: (text, record) => <span>{record.isAdmin ? "yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="actions-container" style={{ display: "flex" }}>
          <button className="btn btn-danger" style={{ width: "100px" }}>
            Block
          </button>
        </div>
      ),
    },
  ];

  const pagination = {
    pageSize: 9,
  };
  return (
    <Layout>
      <h1 className="m-2 text-center">User List</h1>
      <Table
        pagination={pagination}
        columns={columns}
        dataSource={users}
        rowClassName="custom-row-style"
        // scroll={{ y: 650 }}
        rowKey="_id"
        style={{
          margin: "5px",
          border: "1px solid",
          borderRadius: "5px",
          borderColor: "lightgray",
          height: "760px",
        }}
      />
    </Layout>
  );
};

export default Users;
