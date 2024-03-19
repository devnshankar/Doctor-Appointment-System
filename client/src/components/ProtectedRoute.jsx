import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

// props destructure children
export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // get user the comment bellow removes the yellow lines
  // eslint-disable-next-line
  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/getUserData`,
        {
          token: localStorage.getItem("token"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        <Navigate to="/login" />;
        localStorage.clear();
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      console.log(error);
    }
  };

  // we are getting it in initial time so we need to use useeffect
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
