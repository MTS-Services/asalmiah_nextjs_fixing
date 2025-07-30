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

let promocode = new SCHEMA(
  {
    country: {
      type: String,
    },

    promoCode: {
      type: String,
    },

    discount: {
      type: Number,
    },

    type: {
      type: Number,
      enum: [CONST.ALL, CONST.CATEGORY, CONST.PROMO_COMPANY],
    },

    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },

    subcategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "subcategory",
    },

    company: [
      {
        type: mongoose.Types.ObjectId,
        ref: "company",
      },
    ],

    productId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],

    minPurchaseAmount: {
      type: Number,
    },

    maxDiscountAmount: {
      type: Number,
    },

    numberOfUsed: {
      type: Number, // For userCount
    },

    numberOfUsedUser: {
      type: Number, // For usedCount
    },

    uesdUserCount: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      { _id: false },
    ],

    forFreeDelivery: {
      type: Boolean,
    },

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    startDate: {
      type: String,
    },

    endDate: {
      type: String,
    },

    actionType: {
      type: Number,
      enum: [CONST.PROMOTION, CONST.CASHBACK],
    },

    cashBackType: {
      type: Number,
      enum: [CONST.PERCENTAGE, CONST.FIX_AMOUNT],
    },

    supplierShare: {
      type: Number,
      enum: [CONST.OFFARAT, CONST.SUPPLIER, CONST.SHARE],
      default: CONST.OFFARAT,
    },

    rotationCashBack: {
      type: Number,
      enum: [CONST.ONE_TIME, CONST.SEVERAL_TIME],
    },

    cashbackvalidity: {
      type: Number,
    },

    excludedCompany: [
      {
        type: mongoose.Types.ObjectId,
        ref: "company",
      },
    ],
  },
  { timestamps: true }
);

module.exports.PROMO_CODE = mongoose.model("promocode", promocode);
