const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path"); //! deployment

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(
  cors({
    origin: "https://stalwart-malasada-000909.netlify.app",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// routes
//! this is just for dev related purpose
app.get("/", (req, res) => {
  res.status(200).send({
    message: "server running",
  });
});
//
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//static files //!deployment
app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

//port
const port = process.env.PORT || 8080;

//listen port
app.listen(port, () => {
  console.log(
    ` Server Running in ${process.env.NODE_MODE} mode on port ${process.env.port} `
      .bgWhite.black
  );
});
