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

const spinnerSetting = new SCHEMA(
  {
    description: {
      type: String,
    },
    spanMessage: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    userUserPerDay: {
      type: Number,
    },
    showPerUserDay: {
      type: Number,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.INACTIVE,
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

module.exports.SPINNER_SETTING_MODEL = mongoose.model(
  "spinnerSetting",
  spinnerSetting
);

// module.exports.SPINNER_MODEL = mongoose.model("spinner", spinner);

const spinnerData = new SCHEMA(
  {
    spinType: {
      type: Number,
      enum: [
        CONST.PERCENTAGE,
        CONST.FIX_AMOUNT,
        CONST.FREE_DELIVERY,
        CONST.HARD_LUCK,
        CONST.REFERRAL,
      ],
      default: CONST.HARD_LUCK,
    },
    // priority : {
    //   type: Number,
    //   enum: [
    //     CONST.HEIGH ,
    //     CONST.MEDIUM ,
    //     CONST.LOW   ,
    //   ],
    //   default: CONST.LOW,
    // },

    priority: {
      type: Number,
    },

    spanMessage: {
      type: String,
    },
    detail: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    speed: {
      type: Number,
      min: 0, // Assuming speed cannot be negative
    },
    size: {
      type: Number, // You can change this to Number if size is numeric
    },
    value: {
      type: String,
    },
    minAmount: {
      type: Number,
    },
    maxCashBack: {
      type: Number,
    },
    numberOfUse: {
      type: Number,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    // company: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "company",
    // },
    company: [
      {
        type: mongoose.Types.ObjectId,
        ref: "company",
      },
    ],
    spinnerImg: {
      type: String, // Assuming this is a URL or path to the image
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    earnAmount: {
      type: Number,
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

// Create the model
module.exports.SPINNER_MODEL = mongoose.model("spinner", spinnerData);

const userSpinnerRewards = new SCHEMA(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
    deviceToken: {
      type: String,
    },
    spinnerId: {
      type: mongoose.Types.ObjectId,
      ref: "spinner",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    spinType: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    spanMessage: {
      type: String,
    },
    detail: {
      type: String,
    },
    endDate: {
      type: Date,
    },
    size: {
      type: Number, // You can change this to Number if size is numeric
    },
    value: {
      type: String,
    },
    minAmount: {
      type: Number,
    },
    maxCashBack: {
      type: Number,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    spinnerImg: {
      type: String, // Assuming this is a URL or path to the image
    },
    referralCode: {
      type: String,
    },
    numberOfUse: {
      type: Number,
    },
    referralUserBy: {
      type: [String],
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create the model
module.exports.USER_SPINNER_MODEL = mongoose.model(
  "spinnerWin",
  userSpinnerRewards
);
