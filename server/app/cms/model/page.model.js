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

let PAGE_MODEL_SCHEMA = new SCHEMA(
  {
    title: {
      type: String,
    },

    arabicTitle: {
      type: String,
    },

    description: {
      type: String,
    },

    arabicDescription: {
      type: String,
    },

    image: {
      type: String,
    },

    typeId: {
      type: Number,
      enum: [
        CONST.ABOUT,
        CONST.TERMS,
        CONST.PRIVACY,
        CONST.REPORT,
        CONST.RETURN_POLICY,
      ],
    },

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
  },
  { timestamps: true }
);

module.exports.PAGE_MODEL = mongoose.model("page", PAGE_MODEL_SCHEMA);
