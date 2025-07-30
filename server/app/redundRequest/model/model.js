/** 
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const SCHEMA = mongoose.Schema;

const refundRequest = new SCHEMA(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    amount: {
      type: Number,
    },
    stateId: {
      type: Number,
      enum: [CONST.PENDING, CONST.REJECT, CONST.APPROVE, CONST.REFUND],
      default: CONST.PENDING,
    },
    paymentReturnType: {
      type: Number,
      enum: [CONST.WALLET, CONST.ACCOUNT],
    },
  },
  { timestamps: true }
);

module.exports.REFUND_REQUEST = mongoose.model("refundRequest", refundRequest);
