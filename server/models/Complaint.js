const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Complaint Schema
const ComplaintSchema = new Schema({
  // Define fields for the Complaint model
  name: {
    type: String,
    enum: ["Toilets", "Tents", "Health", "Fire", "Sanitation"],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create models from the schemas
module.exports = mongoose.model("Complaint", ComplaintSchema);
