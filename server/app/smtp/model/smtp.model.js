/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");
const smtp = new SCHEMA(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    host: {
      type: String,
    },
    port: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE], // ACTIVE => 1, INACTIVE => 2
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.SMTP = mongoose.model("smtp", smtp);
