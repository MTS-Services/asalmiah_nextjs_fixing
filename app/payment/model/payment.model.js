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

const paymentSchema = new SCHEMA(
  {
    paymentIntentId: {
      type: String,
    },
    chargeId: {
      type: String,
    },
    customerId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    paymentMethodId: {
      type: String,
    },
    paidBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    paidTo: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
    promocode: {
      type: mongoose.Types.ObjectId,
      ref: "promocode",
    },
    couponCode: {
      type: mongoose.Types.ObjectId,
      ref: "coupon",
    },
    invoiceNumber: {
      type: Number,
    },
    webhookId: {
      type: mongoose.Types.ObjectId,
      ref: "webhooks",
    },
    productId: [String],
    status: {
      type: String,
      default: "pending",
    },
    insertDate: {
      type: Number,
    },
    paymentType: {
      type: Number,
      enum: [CONST.ONLINE, CONST.WALLETS],
    },
    isRefund: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const paymentRefundSchema = new SCHEMA(
  {
    chargeId: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
    insertDate: {
      type: Number,
    },
    paymentReturnType: {
      type: Number,
      enum: [CONST.WALLET, CONST.ACCOUNT],
    },
  },
  { timestamps: true }
);

module.exports.REFUND = mongoose.model("refund", paymentRefundSchema);
module.exports.PAYMENT = mongoose.model("payment", paymentSchema);
