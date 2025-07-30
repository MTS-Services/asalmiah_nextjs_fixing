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
const wishlist = new Schema(
  {
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
      ref: "user",
    },
    type: {
      type: Number,
      enum: [CONST.PRODUCT, CONST.COMPANY],
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE],
    },
    isWishlist: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports.WISHLIST = mongoose.model("wishlist", wishlist);
