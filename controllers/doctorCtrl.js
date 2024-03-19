const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

// doctor info getter for the profile page for doctors
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).json({
      success: true,
      message: "doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in fetching Doctor details \n${error.message}`,
    });
  }
};

// update doctor profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Doctor profile Updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Doctor profile update issue \n${error.message}`,
    });
  }
};

// get single doctor by id
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).json({
      success: true,
      message: "Single Doc info fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in getting single doctor info \n${error.message}`,
    });
  }
};

// get doctor appointments 
const getDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({userId:req.body.userId})
    const appointments = await appointmentModel.find({doctorId:doctor._id})
    res.status(200).json({
      success:true,
      message: "Doctor appointment fetched successfully",
      data: appointments,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:`Could not fetch doctor appointments \n${error.message}`
    })
  }
}

// post doctor appointment status controller
const updateStatusController = async (req, res) => {
  try {
    const {appointmentsId, status} = req.body
    const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      status: "Status-updated",
      message: `Your appointment has been ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).json({
      success: true,
      message:"Appointment status updated successfully"
    })
    } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:`Error in appointment update status \n${error.message}`
    })
  }
}
module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  getDoctorAppointmentsController,
  updateStatusController,
};
