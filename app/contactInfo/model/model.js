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

const contactInfo = new schema(
  {
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    whatAppNumber: {
      type: String,
    },
    fbLink: {
      type: String,
    },
    linkedinLink: {
      type: String,
    },
    snapChatLink: {
      type: String,
    },
    instaLink: {
      type: String,
    },
    address: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE],
      default: CONST.ACTIVE,
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

module.exports.CONTACTINFO = mongoose.model("contactInfo", contactInfo);
