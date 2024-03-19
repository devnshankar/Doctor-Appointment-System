import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  // login user data
  const getAllDoctorsData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/getAllDoctors`,
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

  useEffect(() => {
    getAllDoctorsData();
  }, []);
  return (
    <Layout>
      <div style={{ height: "833px", zIndex: "1" }}>
        <h1 className="text-center">Doctors available</h1>
        <div
          style={{ overflow: "scroll", position: "inherit", height: "770px" }}
        >
          <Row >
            {doctors &&
              doctors.map((doctor) => (
                <DoctorList doctor={doctor} key={doctors._id} />
              ))}
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
