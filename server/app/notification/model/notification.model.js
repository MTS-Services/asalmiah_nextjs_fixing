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

const Notification = new SCHEMA(
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
    userId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    image: [
      {
        url: {
          type: String,
        },
      },
    ],
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    from: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Boolean,
      default: false,
    },
    notificationType: {
      type: Number,
      enum: [
        CONST.PRODUCT,
        CONST.ORDER,
        CONST.OFFERE,
        CONST.NOTIFICATION_COMPANY,
        CONST.ADMIN_NOTIFICATION,
        CONST.COMPANY_NOTIFICATION,
        CONST.OUT_STOCK,
      ],
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE],
      default: CONST.ACTIVE,
    },
    roleId: {
      type: Number,
      enum: [CONST.ADMIN, CONST.PROMOTION_USER, CONST.DESIGNED_USER],
    },
  },
  { timestamps: true }
);

module.exports.NOTIFICATION = mongoose.model("notification", Notification);
