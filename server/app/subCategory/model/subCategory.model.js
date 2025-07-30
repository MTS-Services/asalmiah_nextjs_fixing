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

let subcategory = new SCHEMA(
  {
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    subcategory: {
      type: String,
    },
    arabicSubcategory: {
      type: String,
    },
    description: {
      type: String,
    },
    subCategoryImg: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    order: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.SUBCATEGORY_MODEL = mongoose.model("subcategory", subcategory);
