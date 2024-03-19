const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// PI request logger middleware

// middlewares
app.use(
  cors({
    origin: [process.env.CLIENTURL, "http://192.168.29.183:5173"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server running ");
});

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

//port
const port = process.env.PORT || 8081;

//listen port
app.listen(port, () => {
  console.log(
    ` Server Running in ${process.env.NODE_MODE} mode on port ${process.env.port} `
      .bgWhite.black
  );
});
