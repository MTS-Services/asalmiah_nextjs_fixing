/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const schema = mongoose.Schema;
const address = new schema(
  {
    name: {
      type: String,
    },
    arabicName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: Number,
      enum: [CONST.MALE, CONST.FEMALE, CONST.OTHERS],
    },
    area: {
      type: String,
    },
    block: {
      type: String,
    },
    streetName: {
      type: String,
    },
    houseBuilding: {
      type: String,
    },
    appartment: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    type: {
      type: Number,
      enum: [CONST.HOME, CONST.OFFICE, CONST.OTHER],
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    isDefault: {
      type: Boolean,
      default: true,
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
    addresArea: {
      type: String,
    },
    governate: {
      type: String,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports.ADDRESS = mongoose.model("address", address);
