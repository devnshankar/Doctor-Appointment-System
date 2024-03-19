import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"; // Import icons for show/hide password
import { Form, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import "../styles/RegisterStyles.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State variables for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Form submit handler
  const onFinishHandler = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/register`,
        { name, email, password } // Combine values into an object
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Registered Successfully");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went Wrong while registering user");
    }
  };

  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="register-form"
        >
          <div className="form-header flex-column">
            <img
              src="/doctorbuddy-logo.png"
              className="ml-10"
              style={{ width: "50px", margin: "0px auto 10px ", justifyContent: 'center', display: "flex" }}
              alt="Logo"
            ></img>
            <h1 className="form-header-text text-center text-white">
              Register
            </h1>
          </div>
          <Form.Item label="Name" name="name">
            <Input
              type="text"
              placeholder="Type your full name here"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input
              type="email"
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input
              type={showPassword ? "text" : "password"} // Show/hide password based on state
              placeholder="Enter a secure password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffix={
                showPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOutlined onClick={() => setShowPassword(true)} />
                )
              }
            />
          </Form.Item>
          <button className="btn btn-primary mb-3" type="submit">
            Register
          </button>
          <span style={{ color: "rgba(255, 255, 255, 0.88)" }}>
            Already a user?
            <Link
              to="/login"
              className=" p-2"
              style={{
                color: "#0d6efd",
                textDecoration: "underline",
              }}
            >
              Login here
            </Link>
          </span>
        </Form>
      </div>
    </>
  );
};

export default Register;
