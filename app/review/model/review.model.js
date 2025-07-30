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
const review = new schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "auth",
    },
    reviewImg: [
      {
        url: {
          type: String,
        },
      },
    ],
    typeId: {
      type: Number,
      enum: [CONST.PRODUCT, CONST.COMPANY],
      default: CONST.PRODUCT,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

review.index({ productId: 1 });
module.exports.REVIEW = mongoose.model("review", review);
