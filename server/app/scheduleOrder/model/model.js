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
const SCHEMA = mongoose.Schema;

const scheduleOrder = new SCHEMA(
  {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    scheduleBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.SCHEDULE_ORDER = mongoose.model("scheduleOrder", scheduleOrder);
