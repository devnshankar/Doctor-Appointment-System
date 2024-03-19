import React, { useState } from "react";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "../styles/LoginStyles.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Form submit handler
  const onFinishHandler = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/login`,
        { email, password }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successful");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong while logging in");
    }
  };

  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="login-form"
        >
          <div className="form-header">
            <h1 className="form-header-text text-center text-white">Login</h1>
          </div>
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
              placeholder="Enter your password"
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
            Login
          </button>
          <span style={{ color: "rgba(255, 255, 255, 0.88)" }}>
            Not a user? Register here
            <Link
              to="/register"
              className=" p-2"
              style={{
                color: "#0d6efd",
                textDecoration: "underline",
              

              }}
            >
              Register here
            </Link>
          </span>
        </Form>
      </div>
    </>
  );
};

export default Login;
