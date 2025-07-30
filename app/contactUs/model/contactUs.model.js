/** 
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

const contactus = new schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [CONST.NEW, CONST.REPLIED],
      default: CONST.NEW,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports.CONTACTUS = mongoose.model("contactus", contactus);
