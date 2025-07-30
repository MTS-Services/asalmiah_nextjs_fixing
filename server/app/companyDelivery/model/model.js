/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const SCHEMA = mongoose.Schema;

let deliveryCompany = new SCHEMA(
  {
    company: {
      type: String,
    },
    arabicCompany: {
      type: String,
    },
    country: {
      type: String,
    },
    email: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    description: {
      type: String,
    },
    arabicDescription: {
      type: String,
    },
    registration: {
      type: String,
    },
    arabicRegistration: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    address: {
      type: String,
    },
    contactPersonName: {
      type: String,
    },
    arabicContactPersonName: {
      type: String,
    },
    contactPersonMobile: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    costDeliveryOffrat: {
      type: Number,
    },
    costDeliveryCustomer: {
      type: Number,
    },
    companyCode: {
      type: String,
    },
    default: {
      type: Boolean,
    },
    logo: {
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
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
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
  },
  { timestamps: true }
);

module.exports.DELIVERY_COMPANY = mongoose.model(
  "deliveryCompany",
  deliveryCompany
);
