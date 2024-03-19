const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const {ObjectId} = require("mongodb")

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}); //! FIX THE PASSWORDS UNDEFINING PROBLEM
    res.status(200).json({
      success: true,
      message: "Users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error while fetching users \n${error.message}`,
    });
  }
};
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).json({
      success: true,
      message: "Doctors data list",
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
// doctor account status changer
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    // const objectId =new ObjectId(doctor.userId);
    const user = await userModel.findOne({ _id:doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "Doctor-account-request-updated",
      message: `Your Doctor account request is ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor = (status === "approved")? true : false;            //!fixed and added "= status" 
      user.isDoctor = true;
      await user.save();
      res.status(201).json({
        success: true,
        message: "Account status updated",
        data: doctor,
      });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in account status \n${error.message}`,
    });
  }
};
module.exports = { getAllDoctorsController, getAllUsersController, changeAccountStatusController};
