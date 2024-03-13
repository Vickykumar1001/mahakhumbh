const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createComplaint,
  getAllComplaint,
  getSingleComplaint,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");

router
  .route("/")
  .post([authenticateUser], createComplaint)
  .get([authenticateUser, authorizePermissions("admin")], getAllComplaint);

router
  .route("/:id")
  .get([authenticateUser, authorizePermissions("admin")], getSingleComplaint)
  .patch([authenticateUser, authorizePermissions("admin")], updateComplaint)
  .delete([authenticateUser, authorizePermissions("admin")], deleteComplaint);

module.exports = router;
