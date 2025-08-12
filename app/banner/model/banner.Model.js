/**
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Ozvid Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
let schema = mongoose.Schema;

let banner = new schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    bannerImg: {
      type: String,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    productId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    order: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports.BANNER = mongoose.model("banner", banner);
