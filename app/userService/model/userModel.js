/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");
let user = new SCHEMA(
  {
    fullName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    email: {
      type: String,
    },
    socialType: {
      type: "string",
      enum: ["facebook", "google", "apple"],
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    appleId: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: Number,
      default: 0,
    },
    otpExpiration: {
      type: Date,
    },
    profileImg: {
      type: String,
    },
    dob: {
      type: String,
    },
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    postalCode: {
      type: Number,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    stateName: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isNotify: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    userIP: {
      type: String,
    },
    token: {
      type: String,
      default: "",
    },
    deviceToken: {
      type: String,
    },
    tokenExpiration: {
      type: Date,
    },
    isTermsCondition: {
      type: Boolean,
      default: false,
    },
    isNotificationOn: {
      type: Number,
      enum: [CONST.NOTIFICATION_OFF, CONST.NOTIFICATION_ON],
      default: CONST.NOTIFICATION_OFF,
    },
    deviceType: {
      type: Number,
      enum: [CONST.WEB, CONST.ANDROID, CONST.IOS],
      default: CONST.WEB,
    },
    gender: {
      type: Number,
      enum: [CONST.MALE, CONST.FEMALE, CONST.OTHERS],
    },
    roleId: {
      type: Number,
      enum: [
        CONST.ADMIN,
        CONST.USER,
        CONST.SALES,
        CONST.PROMOTION_USER,
        CONST.DESIGNED_USER,
      ],
      default: CONST.USER,
    },
    stateId: {
      type: Number,
      enum: [
        CONST.ACTIVE,
        CONST.INACTIVE,
        CONST.DELETED,
        CONST.BAN,
        CONST.PENDING,
        CONST.REJECT,
      ],
      default: CONST.ACTIVE,
    },
    userName: {
      type: String,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    branch: {
      type: mongoose.Types.ObjectId,
      ref: "branch",
    },
    language: {
      type: String,
    },
    customerId: {
      type: String,
    },
    joinedByReferral: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    deviceUniqueId: {
      type: String,
    },
    country: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
user.index({ location: "2dsphere" });
module.exports.USER = mongoose.model("user", user);
