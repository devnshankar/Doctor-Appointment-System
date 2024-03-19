
import Layout from "../components/Layout";
import { Tabs, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  // read notificaiton handler
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/get-all-notification`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        //! location.reload();
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error(" something went wrong");
    }
  };
  // delete all read notifications handler
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/user/delete-all-notification`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        //! location.reload();
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong while deleting notifications");
    }
  };

  const items = [
    {
      key: 0,
      label: "Unread",
      children: (
        <>
          <div className="d-flex justify-content-end">
            <button
              className="p-2 btn btn-success"
              onClick={handleMarkAllRead}
              style={{
                cursor: "pointer",
                margin: "0px 4px 4px 0px",
                fontSize: "18px",
              }}
            >
              Mark all as read
            </button>
          </div>
          <div style={{ overflow: "scroll", height: "672px" }}>
            {user?.notification.map((notificationMsg) => (
              <div
                key={notificationMsg.index || 1}
                className="card m-1"
                style={{
                  cursor: "pointer",
                  background: "lightgray",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                <div
                  className="card-text p-2"
                  onClick={() => {
                    navigate(notificationMsg.onClickPath);
                  }} //*FIX THIS LATER
                >
                  {notificationMsg.message}{" "}
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      key: 1,
      label: "read",
      children: (
        <>
          <div className="d-flex justify-content-end">
            <button
              className="p-2 btn btn-danger"
              onClick={handleDeleteAllRead}
              style={{
                cursor: "pointer",
                margin: "0px 4px 4px 0px",
                fontSize: "18px",
              }}
            >
              Delete all notifications
            </button>
          </div>
          <div style={{ overflow: "scroll", height: "672px" }}>
            {user?.seennotification.map((notificationMsg) => (
              <div
                key={notificationMsg.index || 1}
                className="card m-1"
                style={{
                  cursor: "pointer",
                  background: "lightgray",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                <div
                  className="card-text p-2"
                  onClick={() => {
                    navigate(notificationMsg.onClickPath);
                  }} //!FIX THIS LATER
                >
                  {notificationMsg.message}{" "}
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];
  return (
    <Layout>
      <h4 className="m-2 text-center">Notifications</h4>
      <Tabs className="m-1" defaultActiveKey="1" items={items}></Tabs>
    </Layout>
  );
};

export default NotificationPage;
