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

let dynamicLabeling = new SCHEMA(
  {
    title: {
      type: String,
    },

    arabicTitle: {
      type: String,
    },

    company: [
      {
        type: mongoose.Types.ObjectId,
        ref: "company",
      },
    ],

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },

    order: {
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

module.exports.DYNAMIC_LABELING = mongoose.model(
  "dynamicLabeling",
  dynamicLabeling
);
