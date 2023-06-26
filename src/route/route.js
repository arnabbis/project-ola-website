const { Router } = require("express");
const express = require("express");
const router = express.Router()
const adminController = require("../controller/adminController");
const userController = require("../controller/userController");
const driverController = require("../controller/driverController");
const middleware = require("../middleware/auth");

// ADMIN API:
router.post("/createAdmin",adminController.createAdmin)
router.post("/login",adminController.login)
router.post("/leaveGrant",adminController.applyLeave)
router.get("/getAllAdmin",adminController.getAllAdmin)
router.delete("/deleteAdmin/:adminId",middleware.authentication,middleware.authorisation,adminController.deleteAdmin)
router.get("/getLeaveByAdmin",adminController.getLeaveByAdmin)
// USER API:
// DRIVER API:

module.exports = router;