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

let coupon = new SCHEMA(
  {
    couponCode: {
      type: String,
    },
    promoAmount:{
      type: Number,
    },
    discount: {
      type: Number,
    },

    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },

    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },

    item: {
      type: String,
    },

    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE],
      default: CONST.ACTIVE,
    },

    productDiscount: {
      type: Number,
    },

    mrp: {
      type: Number,
    },

    itemPrice: {
      type: Number,
    },

    size: {
      type: String,
    },

    color: {
      type: String,
    },
    actualOrderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
  },
  { timestamps: true }
);

module.exports.COUPON = mongoose.model("coupon", coupon);
