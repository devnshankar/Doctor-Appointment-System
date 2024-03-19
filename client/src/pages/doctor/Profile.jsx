import { useDispatch, useSelector } from "react-redux";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import dayjs from "dayjs";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // Update doc form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/doctor/updateProfile`,
        {
          ...values,
          userId: user._id,
          timings: [
            dayjs(values.timings[0]).format("HH:mm"),
            dayjs(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        // navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const params = useParams();
  // get doctor info
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/doctor/getDoctorInfo`,
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <div style={{ height: "832px" }}>
        <h1 className="text-center">Manage Profile</h1>
        {doctor && (
          <Form
            layout="vertical"
            onFinish={handleFinish}
            className="m-3"
            initialValues={{
              ...doctor,
              timings: [
                dayjs(doctor.timings[0], "HH:mm"),
                dayjs(doctor.timings[1], "HH:mm"),
              ],
            }}
          >
            <h4>Personal Details:</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Your first name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Your last name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Your phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="email" placeholder="Your email" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Website" name="website">
                  <Input type="text" placeholder="Your website" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Address"
                  name="address"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Your address" />
                </Form.Item>
              </Col>
            </Row>
            <h4>Professional Details:</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  required
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input type="text" placeholder="Your specialization" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Your experience" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Fees per Consultation"
                  name="feesPerConsultation"
                  required
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Your fees per consultation"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Timings"
                  name="timings"
                  required
                  // rules={[{ required: true }]} //! SOLVE THE TIME CHOOSING ISSUE LATER
                >
                  <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}></Col>
              <Col xs={24} md={24} lg={8}>
                <button className="form-btn btn btn-primary ">
                  Update Profile
                </button>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
