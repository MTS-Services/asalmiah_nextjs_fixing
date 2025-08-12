/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cart = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    deviceToken: {
      type: String,
    },
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    purchase_Price: {
      type: Number,
    },
    product_cost: {
      type: Number,
    },
    productPrice: {
      type: Number,
    },
    mrp: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    shippingCharge: {
      type: Number,
    },
    note: {
      type: String,
    },
    discount: {
      type: Number,
    },
    cashbackAmount: {
      type: Number,
    },
    promocode: {
      type: mongoose.Types.ObjectId,
      ref: "promocode",
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    branch: {
      type: mongoose.Types.ObjectId,
      ref: "branch",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
    promotionApplied: {
      type: Boolean,
      default: false,
    },
    rewardApplied: {
      type: Boolean,
      default: false,
    },
    rewardId: {
      type: mongoose.Types.ObjectId,
      ref: "spinnerWin",
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "dynamicquestion",
          autopopulate: true,
        },
        answerId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "dynamicquestion.answers",
        },
        _id: false,
      },
    ],

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    deliveryCost: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.CART = mongoose.model("cart", cart);
