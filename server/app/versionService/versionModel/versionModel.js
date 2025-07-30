/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");

const versionSchema = new mongoose.Schema(
  {
    platform: {
      type: Number,
      enum: [CONST.ANDROID, CONST.IOS],
      default:CONST.ANDROID
    },
    latestVersion: {
      type: String,
    },
    forceUpdate: {
      type: Boolean,
      default: false,
    },
    releaseNotes: {
      type: String,
    },
    type: {
      type: Number,
      enum: [CONST.USER, CONST.SALES],
      default:CONST.USER

    },
  },
  { timestamps: true }
);

module.exports.VERSION_MODEL = mongoose.model("Version", versionSchema);
