const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const AdminOlaSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    PhoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
      unique: true,
      max: 10,
      min: 5,
    },
    PositionInTheCompany: {
      type: String,
      required: true,
    },
    TotalLeave: {
      type: Number,
      default: 15,
      min: 0,
      max: 15,
    },
    JoiningTime: {
        type: Date,
        default: Date.now(),
      },
      LeavingTime: {
        type: Date,
        default: Date.now(),
    },
    IsInLeave: {
      type: Boolean,
      default: false,
    },
    Leave: {
      type: String,
      enum: ["sickLeave", "earnedLeave", "CompansatoryLeave","none"],
      default:"none"
    },
    LeaveDate:{
      type:Date,
      default:0
    },
    HasLeftCompany: {
      type: Boolean,
      default: false,
    },
    CustomerHandeled: {
      type: Number,
      default: 0,
    },
    HowManyRides: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminOlaSchema);
