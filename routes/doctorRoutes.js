const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  getDoctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorCtrl");

const router = express.Router();

// POST SINGLE DOCTOR INFO || POST
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// POST UPDATE DOCTOR INFO || POST
router.post("/updateProfile", authMiddleware, updateProfileController);

// POST GET SINGLE DOC INFO || POST
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

// GET APPOINTMENTS || GET
router.get("/doctor-appointments", authMiddleware, getDoctorAppointmentsController)

// UPDATE APPOINTMENT STATUS || POST
router.post("/update-status", authMiddleware, updateStatusController)
module.exports = router;

