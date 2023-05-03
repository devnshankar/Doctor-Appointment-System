const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");

const router = express.Router()

// GET USERS CONTROLLER || GET
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// GET DOCTORS CONTROLLER || GET
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// POST ACCOUNT STATUS FOR DOCTOR APPROVAL || POST
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController)

module.exports = router