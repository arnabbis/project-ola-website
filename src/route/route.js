const { Router } = require("express");
const express = require("express");
const router = express.Router()
const adminController = require("../controller/adminController");
const userController = require("../controller/userController");
const driverController = require("../controller/driverController");

// ADMIN API:
router.post("/createAdmin",adminController.createAdmin)
router.post("/login",adminController.login)
router.post("/leaveGrant",adminController.applyLeave)
// USER API:
// DRIVER API:

module.exports = router;