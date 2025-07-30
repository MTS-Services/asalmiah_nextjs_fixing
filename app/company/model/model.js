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

let company = new SCHEMA(
  {
    company: {
      type: String,
    },
    actualCompanyName: {
      type: String,
    },
    arabicActualCompanyName: {
      type: String,
    },
    arabicCompany: {
      type: String,
    },
    actualCompanyName: {
      type: String,
    },
    description: {
      type: String,
    },
    arabicDescription: {
      type: String,
    },
    perCommission: {
      type: Number,
    },
    commissionType: {
      type: Number,
      enum: [CONST.PERCENTAGE, CONST.FIX_AMOUNT],
    },
    couponService: {
      type: Boolean,
    },
    deliveryEligible: {
      type: Boolean,
    },
    pickupService: {
      type: Boolean,
    },
    deliveryCompany: {
      type: mongoose.Types.ObjectId,
      ref: "deliveryCompany",
      default: null,
    },
    costDelivery: {
      type: Number,
    },
    logo: {
      type: String,
    },
    coverImg: {
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
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    subcategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "subcategory",
    },
    refNumber: {
      type: Number,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    email: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    mobile: {
      type: String,
    },
    order: {
      type: Number,
    },
    paymentPeriod: {
      type: Number,
    },
    deliveryService: {
      type: Boolean,
    },
    deliveryCompanyChecked: {
      type: String,
    },
    country: {
      type: String,
      default: "Kuwait",
    },
    totalAverageRating: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.COMPANY_MODEL = mongoose.model("company", company);
