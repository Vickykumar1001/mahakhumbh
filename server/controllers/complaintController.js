const Complaint = require("../models/Complaint");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const getAllComplaint = async (req, res) => {
  const { name, status, sort } = req.query;
  // add stuff based on condition

  const queryObject = {};
  if (name) {
    queryObject.name = name;
  }
  if (status && status !== "all") {
    queryObject.status = status;
  }

  // NO AWAIT

  let result = Complaint.find(queryObject);

  // chain sort conditions

  if (sort === "latest") {
    result = result.sort("-timestamp");
  }
  if (sort === "oldest") {
    result = result.sort("timestamp");
  }
  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const complaints = await result;

  const totalComplaints = await Complaint.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalComplaints / limit);

  res.status(StatusCodes.OK).json({ complaints, totalComplaints, numOfPages });
};
const createComplaint = async (req, res) => {
  const { name, location, description } = req.body;
  const user = req.user.userId;
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  const image = result.secure_url;
  const complaint = await Complaint.create({
    name,
    location,
    description,
    image,
    user,
  });
  res.status(StatusCodes.CREATED).json({ complaint });
};
const getSingleComplaint = async (req, res) => {
  const { id: complaintId } = req.params;

  const complaint = await Complaint.findOne({ _id: complaintId });

  if (!complaint) {
    throw new CustomError.NotFoundError(
      `No complaint with id : ${complaintId}`
    );
  }

  res.status(StatusCodes.OK).json({ complaint });
};
const updateComplaint = async (req, res) => {
  const { id: complaintId } = req.params;

  const complaint = await Complaint.findOneAndUpdate(
    { _id: complaintId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!complaint) {
    throw new CustomError.NotFoundError(
      `No complaint with id : ${complaintId}`
    );
  }

  res.status(StatusCodes.OK).json({ complaint });
};
const deleteComplaint = async (req, res) => {
  const { id: complaintId } = req.params;

  const complaint = await Complaint.findOne({ _id: complaintId });

  if (!complaint) {
    throw new CustomError.NotFoundError(
      `No complaint with id : ${complaintId}`
    );
  }

  await complaint.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! complaint removed." });
};
module.exports = {
  createComplaint,
  getAllComplaint,
  getSingleComplaint,
  updateComplaint,
  deleteComplaint,
};
