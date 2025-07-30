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

let branch = new SCHEMA(
  {
    branchName: {
      type: String,
    },
    arabicBranchName: {
      type: String,
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
    area: {
      type: String,
    },
    isDeliveryPoint: {
      type: Boolean,
    },
    isCouponBranch: {
      type: Boolean,
    },
    CountryCode: {
      type: String,
    },
    deliveryWhatsUpNo: {
      type: Number,
    },
    costDelivery: {
      type: Number,
    },
    deliveryEmail: {
      type: String,
    },
    branchKey: {
      type: String,
    },
    branchId: {
      type: String,
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    workingHours: [
      {
        day: {
          type: String,
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
      },
    ],
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
  },
  { timestamps: true }
);

branch.index({ location: "2dsphere" });
module.exports.BRANCH_MODEL = mongoose.model("branch", branch);
