/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");

let cashBack = new SCHEMA(
  {
    cashBack: {
      type: Number,
    },
    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    description: {
      type: String,
    },

    deductedCashBack: {
      type: Number,
    },

    cashBackDr: {
      type: Number,
    },

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },

    isAdded: {
      // added  amount in wallet when match start date
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports.CASHBACK = mongoose.model("cashBack", cashBack);
