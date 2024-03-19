import React from "react";
import "../styles/LayoutStyles.css";
import { PropTypes } from "prop-types";
import { adminMenu, userMenu } from "../data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  // logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successful");
    navigate("/login");
  };

  //****************************** doctor menu ******************************
  const doctorMenu = [
    {
      id: 0,
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      id: 1,
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      id: 3,
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  //****************************** doctor menu ******************************

  // rendering menu list (?. if user is available then only proceed)
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>DOCTER APP</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <ul key={menu.id} className="menu-item-container">
                    <li className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </li>
                  </ul>
                );
              })}
              <div
                className="menu-item"
                onClick={handleLogout}
                style={{ margin: "5px" }}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content" style={{ position: "relative" }}>
            <div className="header">
              <div className="header-content">
                <Badge
                  className="notification-badge"
                  count={user && user.notification.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i className="fa-solid fa-bell"></i>
                </Badge>
                <Link to="/profile">{user?.name}</Link>
              </div>
            </div>
            <div className="body" style={{ height: "86%", overflowY: "auto" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
