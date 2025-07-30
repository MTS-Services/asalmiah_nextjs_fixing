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

let statementAccount = new SCHEMA(
  {
    paymentPeriod: {
      type: Number,
    },
    beneficiaryName: {
      type: String,
    },
    flexiblePrice: {
      type: Boolean,
    },
    accountantName: {
      type: String,
    },
    accountantTelephone: {
      type: String,
    },
    chequeCompany: {
      type: String,
    },
    linkTelephoneNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    accountNumber: {
      type: Number,
    },
    bankCode: {
      type: String,
    },
    branchName: {
      type: String,
    },
    swiftCode: {
      type: String,
    },
    IBAN: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    accountType: {
      type: Number,
      enum: [CONST.PERCENTAGE, CONST.FIX_AMOUNT],
    },
    paymentMethod: {
      type: Number,
      enum: [
        CONST.CHEQUE,
        CONST.BANK_TRANSFER,
        CONST.LINK,
        CONST.ONLINE_TRANSFER,
        CONST.ADVANCE,
        CONST.PAYPAL,
      ],
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
  },
  { timestamps: true }
);

module.exports.STATEMENT_ACCOUNT = mongoose.model(
  "statementAccount",
  statementAccount
);

let statementTransaction = new SCHEMA(
  {
    type: {
      type: String,
    },
    number: {
      type: Number,
    },
    paymentType: {
      type: Number,
      enum: [CONST.ONLINE, CONST.WALLETS],
    },
    amountDr: {
      type: Number,
    },
    amountCr: {
      type: Number,
    },
    balance: {
      type: Number,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
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
    date: {
      type: Date,
    },
    accountType: {
      type: Number,
      enum: [CONST.PERCENTAGE, CONST.FIX_AMOUNT],
    },
    isManuallyAdded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports.STATEMENT_TRANSACTION = mongoose.model(
  "statementTransaction",
  statementTransaction
);
