const express = require("express");
const {
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
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

// router on project
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

// REGISTER || POST
router.post("/register", registerController);

// AUTH || POST
router.post("/getUserData", authMiddleware, authController);

// APPLY DOCTER || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

// NOTIFICATION || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  markAsReadAllNotificationController
);

// DELETE NOTIFICATION || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

// GET ALL DOCTORS LIST FOR HOMEPAGE || GET
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
module.exports = router;

// BOOK APPOINTMENT || POST
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// BOOKING AVAILABILITY ROUTER || POST
router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

// APPOINTMENTS LIST ROUTER || GET
router.get("/user-appointments", authMiddleware, userAppointmentsController);
