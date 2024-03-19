const userModel = require("../models/userModels");
const dayjs = require("dayjs");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appointmentModel = require("../models/appointmentModel");

// register controller function
const registerController = async (req, res) => {
  try {
    // checking if the user is already registerd or not
    const existingUser = await userModel.findOne({
      email: req.body.email,
    });
    // if user already exists in the database then the user will be redirected to the login page
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User Already Exists", success: false });
    }
    else {
      // getting password from the body
      const password = req.body.password;
      // creating salt for the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // now replacing the password that the user sent with the hashed version we made using bcrypt
      req.body.password = hashedPassword;
      // now we'll create a new user using new data we got
      const newUser = new userModel(req.body);
      // now the new user is saved to the db
      await newUser.save();
      // success message is sent to the client
      res
        .status(200)
        .json({ message: "Registered Successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Failed registering User \n${error.message}`,
    });
  }
};

// login controller function
const loginController = async (req, res) => {
  try {
    // trys to find the user with the help of email from the login form
    const user = await userModel.findOne({ email: req.body.email });
    // if user not found then error message is shown
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }
    else{
      // compares password from login form with db's user's password
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      // if password doesn't match then not recognized message is send to the client
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid email or password", success: false });
      }
      // we're creating a token for the sign in which takes the id of the user and the
      // secret key with the time of expiry of cookie so that use has to login again in 1 day
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      // the success message is sent to the client when user logins sucessfully also sending the token
      res
        .status(200)
        .json({ message: "Login successfull", success: true, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Could not login User Please try again \n${error.message}`, success: false});
  }
};

// Authorization controller function
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(404).json({
        message: "User not found with the provided credentials",
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User found successfully",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Authorization failed \n${error.message}`,
      success: false,
    });
  }
};

// Apply doctor controler function
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({
      ...req.body,
      status: "pending",
    });
    await newDoctor.save();
    // sending messgae to admin that new doctor added in notification
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.userId}: ${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(200).send({
      success: true,
      message: "Doctor account application successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error while applying for Doctor \n${error.message}`,
      
    });
  }
};

// get all unread notification controller

// Notification controller
const markAsReadAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Failed to mark the notifications as read \n${error.message}`,
      success: false,
    });
  }
};

// Notification delete controller
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Unable to delete all notificaions \n${error.message}`,
    });
  }
};

// get all doctor controller for home page
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).json({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error while fetching doctors \n${error.message}`,
    });
  }
};

// book appointment controller
const bookAppointmentController = async (req, res) => {
  try {
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error while booking appointment \n${error.message}`,
    });
  }
};

// booking availability controller
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = req.body.date;
    const fromTime = dayjs(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = dayjs(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).json({
        message: "Appointments not available at this time",
        success: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Appointment available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in booking availability \n${error.message}`,
    });
  }
};

// user appointments getting controller
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).json({
      success: true,
      message: "Users appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in user appointments \n${error.message}`,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  markAsReadAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};
