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
const { setResponseObject } = require("../../../middleware/commonFunction");
const { WALLET } = require("../model/wallet.model");
const { USER } = require("../../userService/model/userModel");

const _wallet = {};

/**
 * Create Wallet With UserId
 */
_wallet.createWallet = async (req, res, next) => {
  try {
    let payloadData = req.body;
    payloadData.userId = req.userId;
    let user = await USER.findOne({ _id: req.userId });
    if (user.isWalletActive === false) {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: "You are not allowed to do this action at this time",
      });
    }

    payloadData.amount = parseInt(req.body.amount);

    let createWallet = await requestCreditAccount(payloadData).save();
    if (user) {
      user.isWalletActive = false;
      user.walletInsertDate = Math.floor(Date.now() / 1000);
      await user.save();
    }
    if (!createWallet) {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: responseMessages.ADD_FAILED("Credit Account"),
      });
    } else {
      res.status(200).send({
        statusCode: 200,
        success: true,
        message: responseMessages.CREDIT_ACCOUNT_REQUESTED,
        data: createWallet,
      });
    }
  } catch (err) {
    await setResponseObject(req, false, err.message, "");
    next();
  }
};
